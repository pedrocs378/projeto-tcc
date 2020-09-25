

module.exports = function (array, propertyName) {
    let occurrences = {}

    return array.filter(function (x) {
        let property = x[propertyName]
        if (occurrences[property]) {
            return false;
        }
        occurrences[property] = true;
        return true;
    })
}
