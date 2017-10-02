'use strict';

const { expect } = require('chai');
const Snail = require('./../src/server/snail');

describe('Snail class', function() {
  beforeEach(function() {
    this.snail = new Snail();
  });

  it('should return success for params h=6&u=3&d=1&f=10', function() {
    const height = 6;
    const up = 3;
    const down = 1;
    const fatigue = 10;
    const result = this.snail.calculateResult(height, up, down, fatigue);

    expect(result.day).to.equal(3);
    expect(result.message).to.equal('success on day 3');
  });

  it('should return failure for params h=10&u=2&d=1&f=50', function() {
    const height = 10;
    const up = 2;
    const down = 1;
    const fatigue = 50;
    const result = this.snail.calculateResult(height, up, down, fatigue);

    expect(result.day).to.equal(4);
    expect(result.message).to.equal('failure on day 4');
  });

  it('should return failure for params h=50&u=5&d=3&f=14', function() {
    const height = 50;
    const up = 5;
    const down = 3;
    const fatigue = 14;
    const result = this.snail.calculateResult(height, up, down, fatigue);

    expect(result.day).to.equal(7);
    expect(result.message).to.equal('failure on day 7');
  });

  it('should return failure for params h=50&u=6&d=4&f=1', function() {
    const height = 50;
    const up = 6;
    const down = 4;
    const fatigue = 1;
    const result = this.snail.calculateResult(height, up, down, fatigue);

    expect(result.day).to.equal(68);
    expect(result.message).to.equal('failure on day 68');
  });

  it('should return success for params h=50&u=6&d=3&f=1', function() {
    const height = 50;
    const up = 6;
    const down = 3;
    const fatigue = 1;
    const result = this.snail.calculateResult(height, up, down, fatigue);

    expect(result.day).to.equal(20);
    expect(result.message).to.equal('success on day 20');
  });

  it('should return failure for params h=1&u=1&d=1&f=1', function() {
    const height = 1;
    const up = 1;
    const down = 1;
    const fatigue = 1;
    const result = this.snail.calculateResult(height, up, down, fatigue);

    expect(result.day).to.equal(2);
    expect(result.message).to.equal('failure on day 2');
  });
});
