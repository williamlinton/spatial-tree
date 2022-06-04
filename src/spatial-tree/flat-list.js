function FlatList(points) {
    this.points = points;
}
FlatList.prototype.query = function (boundingBox) {
    const result = [];
    for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        if (point.lat >= boundingBox.southWest.lat &&
            point.lng >= boundingBox.southWest.lng &&
            point.lat <= boundingBox.northEast.lat &&
            point.lng <= boundingBox.northEast.lng) {
            result.push(point);
        }
    }
    return result;
};

module.exports = {
    FlatList
};