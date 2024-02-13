import mocha from 'mocha';
import jsc from 'jsverify';
import _ from 'lodash';

import defaultObject from '../src/hof-exercise';

const {
  prices,
  sum,
  selectTaxable,
  applyTax,
  baseSum,
  taxSum,
  calculateTotalDeclarative
} = defaultObject;

describe('prices', () => {
  jsc.property('Is correctly implemented', '[{ price: number }]', a =>
    _.isEqual(prices(a), _.map(a, v => v.price))
  );
  jsc.property('Returns an array', '[{ prices: number}]', a =>
    _.isArray(prices(a))
  );
});

describe('sum', () => {
  jsc.property('Is correctly implemented', '[number]', a =>
    _.isEqual(sum(a), _.sum(a))
  );
  jsc.property('Returns a number', '[number]', a => _.isNumber(sum(a)));
});

describe('selectTaxable', () => {
  jsc.property('Is correctly implemented', '[{ taxable: bool }]', a =>
    _.isEqual(selectTaxable(a), _.filter(a, v => v.taxable))
  );
  jsc.property('Returns an array', '[{ taxable: bool }]', a =>
    _.isArray(selectTaxable(a))
  );
});

describe('applyTax', () => {
  jsc.property('Is correctly implemented', '[number]', 'number', (a, n) =>
    _.isEqual(applyTax(a, n), _.map(a, v => v * n))
  );
  jsc.property('Returns an array', '[number]', 'number', (a, n) =>
    _.isArray(applyTax(a, n))
  );
});

describe('baseSum', () => {
  jsc.property(
    'Is correctly implemented',
    '[{ price: number; taxable: bool }]',
    a => _.isEqual(baseSum(a), _.reduce(a, (a, b) => a + b.price, 0))
  );
  jsc.property('Returns a number', '[{ price: number; taxable: bool }]', a =>
    _.isNumber(baseSum(a))
  );
});

describe('taxSum', () => {
  jsc.property(
    'Is correctly implemented',
    '[{ price: nat; taxable: bool }]',
    'number(1)',
    (a, n) =>
      _.isEqual(
        taxSum(a, n),
        _.reduce(a, (a, b) => (b.taxable ? a + b.price * n : a), 0)
      )
  );
  jsc.property(
    'Returns a number',
    '[{ price: nat; taxable: bool }]',
    'number(1)',
    (a, n) => _.isNumber(taxSum(a, n))
  );
});

describe('calculateTotalDeclarative', () => {
  jsc.property(
    'Properly calculates total with correct arguments',
    '[{ price: nat; taxable: bool }]',
    'nat',
    (arr, n) => {
      const tax = n / Number.MAX_VALUE;
      return _.isEqual(
        calculateTotalDeclarative(arr, tax),
        _.reduce(
          arr,
          (acc, { price, taxable }) =>
            taxable ? acc + price * Math.abs(tax) + price : acc + price,
          0
        )
      );
    }
  );
  jsc.property(
    'Returns a number',
    '[{ price: nat; taxable: bool }]',
    'number(1)',
    (a, n) => _.isNumber(calculateTotalDeclarative(a, n))
  );
  jsc.property(
    'Does not mutate the passed in array',
    '[{ price: nat; taxable: bool }]',
    arr => {
      const originalArr = [...arr];
      calculateTotalDeclarative(arr, 0.09);
      return _.isEqual(arr, originalArr);
    }
  );
  jsc.property(
    'Should not calculate negative tax values',
    '[{ price: nat; taxable: bool }]',
    'number(1)',
    (arr, tax) =>
      _.isEqual(
        calculateTotalDeclarative(arr, tax),
        _.reduce(
          arr,
          (acc, { price, taxable }) =>
            taxable ? acc + price * Math.abs(tax) + price : acc + price,
          0
        )
      )
  );
});
