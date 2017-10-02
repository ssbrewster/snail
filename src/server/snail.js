'use strict';

const logger = require('./utils/logger');
const _ = require('lodash');
const SnailLog = require('./models/snail.model');

/**
 * Class that calculates and logs the result for the snail problem
 */
module.exports = class Snail {
  constructor() {
    this.day = 1;
    this.total = 0;
    this.fatigueCache = Object.create(null);
  }

  /**
   * This method delegates the validation, calculation and storing of the snail log
   * to other methods in this class and returns the result
   */
  async logSnailResult(req) {
    const validated = this.validated(req.body);

    if (!validated.valid) {
      throw new Error(
        `Invalid request parameters: ${JSON.stringify(validated.errors)}`
      );
    }

    const snailLog = {
      h: Number.parseFloat(req.body.h, 10),
      u: Number.parseFloat(req.body.u, 10),
      d: Number.parseFloat(req.body.d, 10),
      f: Number.parseFloat(req.body.f, 10)
    };

    const result = this.calculateResult(
      snailLog.h,
      snailLog.u,
      snailLog.d,
      snailLog.f
    );

    snailLog.result = result.message;
    snailLog.success = result.success;
    snailLog.day = result.day;

    try {
      await this.logToDb(snailLog);
    } catch (err) {
      return `Mongo error: ${err}`;
    }

    logger.debug(`result is ${result.message}`);
    return result.message;
  }

  /**
   * Validate the request body
   *
   * Request body should be in the following format:
   * {
   *   h: <NumberDecimal>
   *   u: <NumberDecimal>,
   *   d: <NumberDecimal>,
   *   f: <NumberDecimal>,
   * }
   *
   * Numbers should be in the range 1 - 100.
   */
  validated(requestBody) {
    const validProps = ['h', 'u', 'd', 'f'];
    const validated = Object.create(null);

    const validationErrors = _.filter(requestBody, (value, key) => {
      return validProps.includes(key) === false;
    });

    if (validationErrors.length) {
      validated.valid = false;
      validated.errors = validationErrors;

      return validated;
    }

    validated.valid = true;
    return validated;
  }

  /**
   * Calculate the result
   *
   */
  calculateResult(height, up, down, fatigue) {
    while (this.total <= height) {
      const fatigueApplied = this.applyFatigue(this.day, up, fatigue);

      this.total += fatigueApplied;

      if (this.total > height) {
        return Object.create({
          day: this.day,
          message: `success on day ${this.day}`,
          success: true
        });
      }

      this.total -= down;

      if (this.total < 0) {
        return Object.create({
          day: this.day,
          message: `failure on day ${this.day}`,
          success: false
        });
      }

      logger.debug(`total at day ${this.day} is ${this.total}`);

      this.day++;

      return this.calculateResult(
        height,
        fatigueApplied,
        down,
        fatigue,
        this.total
      );
    }

    return Object.create({
      day: Number.parseInt(this.day, 10),
      message: `success on day ${this.day}`,
      success: true
    });
  }

  /**
   * Calculate the effect of fatigue and subtract if from the number of feet climbed
   */
  applyFatigue(day, up, fatigue) {
    if (this.day === 1) {
      return up;
    }

    if (this.fatigueCache.fatigueEffect) {
      return up - this.fatigueCache.fatigueEffect;
    }

    const fatiguePercent = fatigue / 100;
    const fatigueEffect = up * fatiguePercent;

    this.fatigueCache.fatigueEffect = fatigueEffect;

    const fatigueApplied = up - fatigueEffect;

    logger.debug(`up after fatigue applied ${fatigueApplied}`);
    return fatigueApplied;
  }

  logToDb(snailLog) {
    const log = new SnailLog(snailLog);

    logger.debug(`will store log to db: ${JSON.stringify(snailLog, null, 2)}`);

    return log.save();
  }

  getPastResults() {
    return SnailLog.find({});
  }

  async generateReport() {
    let report;

    try {
      report = await SnailLog.aggregate([
        {
          $match: {}
        },
        {
          $group: {
            _id: null,
            totalSuccesses: {
              $sum: { $cond: [{ $eq: ['$success', true] }, '$success', 0] }
            },
            totalFailures: {
              $sum: { $cond: [{ $eq: ['$success', false] }, '$success', 0] }
            },
            avgTotalClimbed: { $avg: '$h' },
            avgSuccessTime: {
              $avg: { $cond: [{ $eq: ['$success', true] }, '$day', 0] }
            },
            avgFailureTime: {
              $avg: { $cond: [{ $eq: ['$success', false] }, '$day', 0] }
            }
          }
        }
      ]);
    } catch (err) {
      throw new Error(`Mongo error: JSON.stringify(err, null, 4)`);
    }

    return report;
  }
};
