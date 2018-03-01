import 'babel-polyfill';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
  getJsonDiff,
  checkArryTypeDiff,
  checkObjectTypeDiffAdd,
  checkObjectDiffDelete,
} from '../src/JsonDiff';

describe('Json Diff', () => {
  describe('#checkObjectTypeDiffAdd', () => {
    it('should return the property diff between two object', () => {
      const res = [];
      checkObjectTypeDiffAdd({}, { color: 'blue' }, res, '');
      expect(res[0]).to.equal('Add .color:blue');
    });
    it('should return the property inside property diff between two object', () => {
      const res = [];
      checkObjectTypeDiffAdd({}, { color: { deep: 'blue' } }, res, '');
      expect(res[0]).to.equal('Add .color.deep:blue');
    });
    it('should return multi properties diff ', () => {
      const res = [];
      checkObjectTypeDiffAdd({}, { color: { deep: 'blue' }, shadow: 'light' }, res, '');
      expect(res).to.deep.equal(['Add .color.deep:blue', 'Add .shadow:light']);
    });
    it('should ignore properties that also exists in the old json ', () => {
      const res = [];
      checkObjectTypeDiffAdd(
        { shadow: 'light' },
        { color: { deep: 'blue' }, shadow: 'light' },
        res,
        '',
      );
      expect(res).to.deep.equal(['Add .color.deep:blue']);
    });
    it('should not return anything when two json are the same ', () => {
      const res = [];
      checkObjectTypeDiffAdd(
        { color: { deep: 'blue' }, shadow: 'light' },
        { color: { deep: 'blue' }, shadow: 'light' },
        res,
        '',
      );
      expect(res).to.deep.equal([]);
    });
    it('write update if value where changed ', () => {
      const res = [];
      checkObjectTypeDiffAdd(
        { color: { deep: 'blue' }, shadow: 'light' },
        { color: { deep: 'blue' }, shadow: 'dark' },
        res,
        '',
      );
      expect(res).to.deep.equal(['Update .shadow:dark']);
    });
  });
  describe('#checkObjectDiffDelete', () => {
    it('write Delete if the head is ahead  ', () => {
      const res = [];
      checkObjectDiffDelete(
        { color: { deep: 'blue' }, shadow: 'light' },
        { color: { deep: 'blue' } },
        res,
        '',
      );
      expect(res).to.deep.equal(['Delete .shadow:light']);
    });
    it('should return new element in array', () => {
      const res = getJsonDiff(
        { color: { deep: 'blue' }, shadow: 'light' },
        { color: { deep: 'blue' } },
      );
      expect(res).to.deep.equal(['Delete .shadow:light']);
    });
  });
  describe('#checkArryTypeDiff', () => {
    it('should return the array diff', () => {
      const res = [];
      checkArryTypeDiff([], ['1'], res, '');
      expect(res[0]).to.equal('Add .[0]>1');
    });
    it('should return the array update', () => {
      const res = [];
      checkArryTypeDiff(['3'], ['1'], res, '');
      expect(res[0]).to.equal('Update .[0]>1');
    });
    it('should return the diff of a complex array', () => {
      const res = [];
      checkArryTypeDiff([], [[1, 2], [3, 4]], res, '');
      expect(res).to.deep.equal([
        'Add .[0].[0]>1',
        'Add .[0].[1]>2',
        'Add .[1].[0]>3',
        'Add .[1].[1]>4',
      ]);
    });
  });
});
