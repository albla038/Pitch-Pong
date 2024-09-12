export default class Ball {
  private _x: number;
  private _y: number;
  private _radius: number;
  private _speed: number;
  private _color: string;
  private _velocity: { x: number; y: number };

  constructor(
    x: number,
    y: number,
    radius: number,
    speed: number,
    color: string,
  ) {
    this._x = x;
    this._y = y;
    this._radius = radius;
    this._speed = speed;
    this._color = color;

    const angle = this._getRandomAngle();
    this._velocity = {
      x: this._speed * Math.cos(angle),
      y: this._speed * Math.sin(angle),
    };
  }

  private _getRandomAngle() {
    const seed = Math.random();
    if (seed < 0.5) {
      return (3 / 4) * Math.PI + Math.random() * (5 / 4 - 3 / 4) * Math.PI;
    } else {
      return (-1 / 4) * Math.PI + Math.random() * (1 / 4 - -1 / 4) * Math.PI;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this._x, this._y, this._radius, 0, 2 * Math.PI);
    context.fillStyle = this._color;
    context.fill();
  }

  move() {
    this._x += this._velocity.x;
    this._y += this._velocity.y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get radius() {
    return this._radius;
  }

  reflect_x() {
    this._velocity.x = -this._velocity.x;
  }

  reflect_y() {
    this._velocity.y = -this._velocity.y;
  }
}
