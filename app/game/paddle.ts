export default class Paddle {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  private _radius: number;
  private _color: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    color: string
  ) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._radius = radius;
    this._color = color;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get x_br() {
    return this._x + this._width;
  }

  get y_br() {
    return this._y + this._height;
  }

  move(
    upperBound: number,
    lowerBound: number,
    speed: number,
    direction: "up" | "down"
  ) {
    // Move paddle up
    if (direction === "up") {
      if (this._y > upperBound) {
        this._y -= speed;
      }
    }

    // Move paddle down
    if (direction === "down") {
      if (this.y_br < lowerBound) {
        this._y += speed;
      }
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this._color;
    context.beginPath();
    context.roundRect(this._x, this._y, this._width, this._height, 10);
    context.fill();
  }
}
