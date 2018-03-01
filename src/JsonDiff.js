function getJsonDiff(currentJson, newJson) {
    let pathChange = [];
    checkObjectTypeDiffAdd(currentJson, newJson, pathChange, "");
    checkObjectDiffDelete(currentJson, newJson, pathChange, "");

    return pathChange;
}
function checkObjectTypeDiffAdd(currentJson, newJson, changeList, currentPath) {
    if (typeof newJson == "object") {
        for (let key of Object.keys(newJson))
            checkObjectTypeDiffAdd(
                currentJson[key] ? currentJson[key] : {},
                newJson[key],
                changeList,
                `${currentPath}.${key}`
            );
    } else {
        if (currentJson !== newJson)
            changeList.push(
                `${
                    typeof currentJson === "object" ? "Add" : "Update"
                } ${currentPath}:${newJson}`
            );
    }
}
function checkObjectDiffDelete(currentJson, newJson, changeList, currentPath) {
    if (typeof currentJson == "object") {
        for (let key of Object.keys(currentJson))
            checkObjectDiffDelete(
                currentJson[key],
                newJson[key] ? newJson[key] : {},
                changeList,
                `${currentPath}.${key}`
            );
    } else {
        if (currentJson !== newJson && typeof newJson === "object")
            changeList.push(`Delete ${currentPath}:${currentJson}`);
    }
}

export { getJsonDiff };
