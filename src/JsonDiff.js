function checkArryTypeDiff(currentArray, newArray, changeList, currentPath = '') {
  if (Array.isArray(newArray) && newArray !== undefined) {
    for (let key = 0; key < newArray.length; key += 1) {
      checkArryTypeDiff(
        currentArray[key] ? currentArray[key] : [],
        newArray[key],
        changeList,
        `${currentPath}.[${key}]`,
      );
    }
  } else if (currentArray !== newArray) {
    changeList.push(`${Array.isArray(currentArray) ? 'Add' : 'Update'} ${currentPath}>${newArray}`);
  }
}

function checkObjectTypeDiffAdd(currentJson, newJson, changeList, currentPath = '') {
  if (typeof newJson === 'object') {
    if (!Array.isArray(newJson)) {
      Object.keys(newJson).forEach((key) => {
        checkObjectTypeDiffAdd(
          currentJson[key] ? currentJson[key] : {},
          newJson[key],
          changeList,
          `${currentPath}.${key}`,
        );
      });
    } else {
      checkArryTypeDiff(currentJson, newJson, changeList, currentPath);
    }
  } else if (currentJson !== newJson) {
    changeList.push(`${typeof currentJson === 'object' ? 'Add' : 'Update'} ${currentPath}:${newJson}`);
  }
}

function checkObjectDiffDelete(currentJson, newJson, changeList, currentPath = '') {
  if (typeof currentJson === 'object') {
    Object.keys(currentJson).forEach((key) => {
      checkObjectDiffDelete(
        currentJson[key],
        newJson[key] ? newJson[key] : {},
        changeList,
        `${currentPath}.${key}`,
      );
    });
  } else if (currentJson !== newJson && typeof newJson === 'object') {
    changeList.push(`Delete ${currentPath}:${currentJson}`);
  }
}

function getJsonDiff(currentJson, newJson) {
  const pathChange = [];
  checkObjectTypeDiffAdd(currentJson, newJson, pathChange);
  checkObjectDiffDelete(currentJson, newJson, pathChange);
  return pathChange;
}
export { getJsonDiff, checkObjectTypeDiffAdd, checkObjectDiffDelete, checkArryTypeDiff };
