'use strict';

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
  logSnailResult(req) {
    // const validated = this.validate(req.body);

    // if (!validated.valid) {
    // res.error(400).send(validated.error);
    // }
    //

    const result = this.calculateResult(
      req.body.h,
      req.body.u,
      req.body.d,
      req.body.f,
      this.total
    );

    // await logToDb(result);

    console.log(`result is ${result}`);
    return result;
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
  validated(requestBody) {}

  /**
   * Calculate the result
   *
   */
  calculateResult(height, up, down, fatigue, total) {
    while (total <= height) {
      const fatigueApplied = this.applyFatigue(this.day, up, fatigue);

      total += fatigueApplied;

      if (total > height) {
        return `success on day ${this.day}`;
      }

      total -= down;

      if (total < 0) {
        return `failure on day ${this.day}`;
      }

      console.log(`total at day ${this.day} is ${total}`);

      this.day++;

      return this.calculateResult(height, fatigueApplied, down, fatigue, total);
    }

    return this.day;
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

    console.log(`up after fatigue applied ${fatigueApplied}`);
    return fatigueApplied;
  }
};
