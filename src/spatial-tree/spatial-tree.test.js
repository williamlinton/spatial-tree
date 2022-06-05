const { FlatList } = require("./flat-list");
const { Point, BoundingBox, arePointsEqual, SpatialTree, doBoundingBoxesOverlap } = require("./spatial-tree");

describe("flat list", () => {
    test("flat list returns points within boundingBox", () => {
        const points = [
            new Point(10, 20)
        ];
        const boundingBox = new BoundingBox(
            new Point(0, 0),
            new Point(40, 40),
        );
        const flatList = new FlatList(points);
        const result = flatList.query(boundingBox);
        expect(result.length).toBe(1);
        expect(arePointsEqual(points[0], result[0])).toBe.true;
    });

    test("flat list returns no points outside of boundingBox", () => {
        const points = [
            new Point(10, 20)
        ];
        const boundingBox = new BoundingBox(
            new Point(0, 0),
            new Point(5, 5),
        );
        const flatList = new FlatList(points);
        const result = flatList.query(boundingBox);
        expect(result.length).toBe(0);
    });

    test("flat list distinguishes between found and non-found points", () => {
        const points = [
            new Point(10, 20),
            new Point(50, 50),
        ];
        const boundingBox = new BoundingBox(
            new Point(0, 0),
            new Point(40, 40),
        );
        const flatList = new FlatList(points);
        const result = flatList.query(boundingBox);
        expect(result.length).toBe(1);
        console.log(result);
        expect(arePointsEqual(points[0], result[0])).toBe.true;
    });
});

describe("doBoundingBoxesOverlap", () => {
    test("true if they overlap", () => {
        const box1 = new BoundingBox(
            new Point(0, 0),
            new Point(20, 20),
        );
        const box2 = new BoundingBox(
            new Point(10, 10),
            new Point(30, 30),
        );
        expect(doBoundingBoxesOverlap(box1, box2)).toBe.true;
    });

    test("true if they overlap but args are switched", () => {
        const box1 = new BoundingBox(
            new Point(0, 0),
            new Point(20, 20),
        );
        const box2 = new BoundingBox(
            new Point(10, 10),
            new Point(30, 30),
        );
        expect(doBoundingBoxesOverlap(box2, box1)).toBe.true;
    });

    test("false if they don't overlap", () => {
        const box1 = new BoundingBox(
            new Point(0, 0),
            new Point(20, 20),
        );
        const box2 = new BoundingBox(
            new Point(25, 25),
            new Point(30, 30),
        );
        expect(doBoundingBoxesOverlap(box1, box2)).toBe.false;
    });
});

describe("spatial tree", () => {
    test("spatial tree returns points within boundingBox", () => {
        const points = [
            new Point(10, 20)
        ];
        const boundingBox = new BoundingBox(
            new Point(0, 0),
            new Point(40, 40),
        );
        const spatialTree = new SpatialTree(points);
        const result = spatialTree.query(boundingBox);
        expect(result.length).toBe(1);
        expect(arePointsEqual(points[0], result[0])).toBe.true;
    });

    test("spatial tree returns no points outside of boundingBox", () => {
        const points = [
            new Point(10, 20)
        ];
        const boundingBox = new BoundingBox(
            new Point(0, 0),
            new Point(5, 5),
        );
        const spatialTree = new SpatialTree(points);
        const result = spatialTree.query(boundingBox);
        expect(result.length).toBe(0);
    });

    test("spatial tree distinguishes between found and non-found points", () => {
        const points = [
            new Point(10, 20),
            new Point(50, 50),
        ];
        const boundingBox = new BoundingBox(
            new Point(0, 0),
            new Point(40, 40),
        );
        const spatialTree = new SpatialTree(points);
        const result = spatialTree.query(boundingBox);
        expect(result.length).toBe(1);
        expect(arePointsEqual(points[0], result[0])).toBe.true;
    });

    test("spatial tree distinguishes between found and non-found points in slightly larger dataset", () => {
        const points = [
            new Point(10, 20),
            new Point(0, 20),
            new Point(1, 20),
            new Point(10, 20.54),
            new Point(10.333, 20),
            new Point(50, 20),
            new Point(-10, 20),
            new Point(-10, 70),
            new Point(10, 80),
            new Point(10, 20),
            new Point(10, -20),
            new Point(10, 20),
            new Point(90, 20),
            new Point(30, 20),
            new Point(10, 20),
            new Point(20, 20),
            new Point(50, 50),
        ];
        const boundingBox = new BoundingBox(
            new Point(0, 0),
            new Point(40, 40),
        );
        const spatialTree = new SpatialTree(points);
        const result = spatialTree.query(boundingBox);
        expect(result.length).toBe(10);
    });
});