import { test } from './test';
import gjk from '../physics/collision/gjk';
import Circle from '../physics/collision/circle';

test('circle not intersecting 1', gjk, [
    new Circle(0, 0, 4),
    new Circle(10, 10, 4)
], [ 6.142135623731 ]);

test('circle not intersecting 2', gjk, [
    new Circle(-5, 5, 1),
    new Circle(4, 4, 3)
], [ 5.0553851381374 ]);

test('circle not intersecting 3', gjk, [
    new Circle(-5, 5, 1),
    new Circle(6, 8, 3)
], [ 7.4017542509914 ]);

test('circle intersecting 1', gjk, [
    new Circle(0, 0, 4),
    new Circle(2, 2, 4),
], [0]);

test('circle intersecting 2', gjk, [
    new Circle(0, 0, 4),
    new Circle(8, 0, 4),
], [0]);