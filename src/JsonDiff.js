function getJsonDiff(currentJson, newJson) {
    let pathChange = [];
    checkObjectTypeDiff(currentJson, newJson, pathChange, "");
    return pathChange;
}

function checkObjectTypeDiff(currentJson, newJson, changeList, currentPath) {
    if (typeof newJson == "object") {
        for (let key of Object.keys(newJson))
            checkObjectTypeDiff(
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

export { getJsonDiff };
