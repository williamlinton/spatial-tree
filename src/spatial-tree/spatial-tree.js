function BoundingBox(southWest, northEast) {
    this.southWest = southWest;
    this.northEast = northEast;
}

function Point(lat, lng) {
    this.lat = lat;
    this.lng = lng;
}

function arePointsEqual(point1, point2) {
    return point1.lat === point2.lat &&
           point1.lng === point2.lng;
}

function Rectangle(boundingBox) {
    this.boundingBox = boundingBox;
    this.children = [];
    this.startIndex = 0;
    this.endIndex = 0;
}

// start = 10
// end = 24
function splitRectangle(parentRect, points, startIndex, endIndex, depth) {
    parentRect.startIndex = startIndex;
    parentRect.endIndex = endIndex;
    if (depth > 0) {
        // 4 = 4 / 2 - 1 = 1
        // 5 = 5 / 2 - 1 = 1.5 = 2
        // 17 = 17 / 2 - 1 = 7.5 = 8

        //                                  24 - 10 = 14 / 2 = 7 + 10 - 1
        const middleItemIndex = Math.ceil((endIndex - startIndex) / 2 + startIndex - 1);
        const leftMaxLng = points[middleItemIndex].lng;
        const rightMinLng = points[middleItemIndex + 1].lng;

        const leftRect = new Rectangle(
            new BoundingBox(
                new Point(minLat, minLng),
                new Point(maxLat, leftMaxLng)
            ),
        );

        const rightRect = new Rectangle(
            new BoundingBox(
                new Point(minLat, rightMinLng),
                new Point(maxLat, maxLng),
            ),
        );

        parentRect.children = [ leftRect, rightRect ];
        splitRectangle(leftRect, points, startIndex, middleItemIndex, depth - 1);
        splitRectangle(rightRect, points, middleItemIndex + 1, endIndex, depth - 1);
    }
}

function doBoundingBoxesOverlap(box1, box2) {
    return (box1.southWest.lng <= box2.northEast.lng ||
           box1.northEast.lng >= box2.southWest.lng) &&
           (box1.southWest.lat <= box2.northEast.lat ||
           box1.northEast.lat >= box2.southWest.lat);
}

function doesPointFallWithinBoundingBox(point, box) {
    return (point.lng <= box.northEast.lng &&
            point.lng >= box.southWest.lng &&
            point.lat <= box.northEast.lat &&
            point.lat >= box.southWest.lat);
}

function SpatialTree(points) {
    this.rectangles = [];
    this.depth = 0;
    this.points = [ ...points ];

    let minLat = 999;
    let maxLat = -999;
    let minLng = 999;
    let maxLng = -999;

    this.points.sort((a, b) => {
        if (a.lng > b.lng) {
            return 1;
        }
        if (b.lng > a.lng) {
            return -1;
        }
        return 0;
    });

    for (let p = 0; p < this.points.length; p++) {
        const point = this.points[p];
        if (point.lat > maxLat) {
            maxLat = point.lat;
        }
        if (point.lng > maxLng) {
            maxLng = point.lng;
        }
        if (point.lat < minLat) {
            minLat = point.lat;
        }
        if (point.lng < minLng) {
            minLng = point.lng;
        }
    }

    this.rootRect = new Rectangle(
        new BoundingBox(
            new Point(minLat, minLng),
            new Point(maxLat, maxLng),
        )
    );

    splitRectangle(this.rootRect, this.points, 0, points.length - 1, this.depth);
}
SpatialTree.prototype.query = function (boundingBox) {
    const result = [];
    let currentDepth = this.depth;
    let rectangles = [ this.rootRect ];

    for (let r = 0; r < rectangles.length; r++) {
        const rect = rectangles[r];
        if (doBoundingBoxesOverlap(boundingBox, rect.boundingBox)) {
            for (let p = rect.startIndex; p <= rect.endIndex ; p++) {
                if (doesPointFallWithinBoundingBox(this.points[p], boundingBox)) {
                    result.push(this.points[p]);
                }
            }
        }
    }
    
    return result;
};

// const build = () => {};
module.exports = {
    // build,
    arePointsEqual,
    doBoundingBoxesOverlap,
    BoundingBox,
    Point,
    SpatialTree
};