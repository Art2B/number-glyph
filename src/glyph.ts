import Helpers from "./helpers";
import { ConsecutiveNumber, Coordinates, DirectionVector } from "./types";

type GlyphOptions = {
  displayHelpCircles: boolean;
  maxDigits: number;
};

export class Glyph {
  private ctx: CanvasRenderingContext2D;
  public startCoordinates: Coordinates;

  private _height!: number;
  private _width!: number;
  private _digit!: string;
  private blockHeight!: number;
  private blockWidth!: number;

  private digitsArray: number[] = [];
  private digitsCoordinates: Coordinates[] = [];
  private digitsDirections: DirectionVector[] = [];
  private consecutiveNumbers: ConsecutiveNumber[] = [];

  private options: GlyphOptions = {
    displayHelpCircles: false,
    maxDigits: 4,
  };

  private style = {
    helpCircleFillStyle: "rgba(191, 191, 191, 0.1)",
    helpCircleRadius: 10,
    strokeStyle: "indianred",
    lineWidth: 5,
    sameDirectionLineLength: 10,
    consecutiveNumberCircleRadius: 15,
    smallCircleRadius: 5,
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    height: number,
    width: number,
    startCoordinates: Coordinates = { x: 0, y: 0 },
    options: Partial<GlyphOptions>
  ) {
    this.ctx = ctx;
    this.height = height;
    this.width = width;
    this.startCoordinates = startCoordinates;

    this.options = {
      ...this.options,
      ...options,
    };
  }

  set height(value: number) {
    this._height = value;
    this.blockHeight = Math.floor(value / 4);
  }

  set width(value: number) {
    this._width = value;
    this.blockWidth = Math.floor(value / 3);
  }

  get height() {
    return this._height;
  }

  get width() {
    return this._width;
  }

  set number(value: string) {
    this._digit = value.slice(0, this.options.maxDigits);
    this.digitsArray = Helpers.splitStringIntoDigits(this.number);
    this.digitsCoordinates = this.digitsArray.map((el) =>
      this.getNumberCoordinate(el)
    );
    this.digitsDirections = this.digitsArray.map((el, index, arr) => {
      if (index === arr.length - 1) {
        return { x: 0, y: 0 };
      }

      return this.getNumberDirection(el, arr[index + 1]);
    });

    this.consecutiveNumbers = Helpers.getConsecutiveNumbers(this.digitsArray);
  }

  get number() {
    return this._digit;
  }

  public draw() {
    this.ctx.clearRect(
      this.startCoordinates.x,
      this.startCoordinates.y,
      this.width,
      this.height
    );

    if (this.options.displayHelpCircles) {
      this.drawHelpCircles();
    }

    if (!this._digit) {
      throw new Error(
        "Glyph cannot be draw without setting number property first."
      );
    }

    if (
      this.consecutiveNumbers.length !== 1 ||
      this.consecutiveNumbers[0].occurence !== this.options.maxDigits - 1
    ) {
      // Draw small circle
      const circleCoord = this.getStartCircleCoordinates();
      this.ctx.beginPath();
      this.ctx.arc(
        circleCoord.x,
        circleCoord.y,
        this.style.smallCircleRadius,
        0,
        2 * Math.PI
      );
      this.ctx.fillStyle = this.style.strokeStyle;
      this.ctx.fill();
      this.ctx.closePath();
    }

    // Set line styles
    this.ctx.strokeStyle = this.style.strokeStyle;
    this.ctx.lineWidth = this.style.lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.beginPath();
    // Draw all the lines first
    Helpers.generateArrayWithDifferentAdjacentDigits(this.digitsArray).forEach(
      (digit, index) => {
        const coordinates = this.getNumberCoordinate(digit);
        if (index === 0) {
          this.ctx.moveTo(coordinates.x, coordinates.y);
        } else {
          this.ctx.lineTo(coordinates.x, coordinates.y);
        }
      }
    );
    this.ctx.stroke();
    this.ctx.closePath();

    // Draw same directions
    this.digitsArray.forEach((digit, index) => {
      if (
        index !== 0 &&
        Helpers.isSameDirection(
          this.digitsDirections[index],
          this.digitsDirections[index - 1]
        ) &&
        digit !== this.digitsArray[index - 1]
      ) {
        const coordinates = this.getNumberCoordinate(digit);
        const nextCoordinates = this.getNumberCoordinate(
          this.digitsArray[index + 1]
        );

        const normalizedPerpendicularVector =
          Helpers.getNormalizedVectorFromCoordinates(
            coordinates,
            nextCoordinates
          );

        this.ctx.beginPath();
        this.ctx.lineCap = "butt";
        this.ctx.lineJoin = "miter";
        this.ctx.moveTo(
          coordinates.x +
            normalizedPerpendicularVector.x *
              this.style.sameDirectionLineLength,
          coordinates.y +
            normalizedPerpendicularVector.y * this.style.sameDirectionLineLength
        );
        this.ctx.lineTo(
          coordinates.x -
            normalizedPerpendicularVector.x *
              this.style.sameDirectionLineLength,
          coordinates.y -
            normalizedPerpendicularVector.y * this.style.sameDirectionLineLength
        );
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        this.ctx.moveTo(
          this.digitsCoordinates[index - 1].x,
          this.digitsCoordinates[index - 1].y
        );
      }
    });

    // Draw circle on consecutive numbers
    this.consecutiveNumbers.forEach((element) => {
      const coordinates = this.getNumberCoordinate(element.digit);

      this.ctx.beginPath();
      this.ctx.arc(
        coordinates.x,
        coordinates.y,
        this.style.consecutiveNumberCircleRadius,
        0,
        2 * Math.PI
      );
      this.ctx.stroke();
      this.ctx.closePath();

      if (element.occurence >= 2) {
        this.ctx.beginPath();
        this.ctx.moveTo(
          coordinates.x - this.style.consecutiveNumberCircleRadius,
          coordinates.y
        );
        this.ctx.lineTo(
          coordinates.x + this.style.consecutiveNumberCircleRadius,
          coordinates.y
        );
        this.ctx.stroke();
        this.ctx.closePath();
      }

      if (element.occurence >= 3) {
        this.ctx.beginPath();
        this.ctx.moveTo(
          coordinates.x,
          coordinates.y - this.style.consecutiveNumberCircleRadius
        );
        this.ctx.lineTo(
          coordinates.x,
          coordinates.y + this.style.consecutiveNumberCircleRadius
        );
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });

    // Draw lines that goes in inverted directions
    this.digitsDirections.forEach((direction, index) => {
      if (index === 0 || index === this.digitsDirections.length - 1) {
        return;
      }

      if (
        this.digitsDirections.slice(0, index).some((dd) => {
          return Helpers.isOppositiveDirection(direction, dd);
        })
      ) {
        const coordinates = this.getNumberCoordinate(this.digitsArray[index]);
        const endCoordinates = this.getNumberCoordinate(
          this.digitsArray[index + 1]
        );

        const xOffset = direction.y !== 0 ? 10 * direction.y : 0;
        const yOffset = xOffset === 0 ? -10 * direction.x : 0;

        this.ctx.beginPath();
        this.ctx.moveTo(coordinates.x + xOffset, coordinates.y + yOffset);

        this.ctx.lineTo(endCoordinates.x + xOffset, endCoordinates.y + yOffset);

        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }

  private drawHelpCircles() {
    for (let i = 0; i < 9; i++) {
      const x =
        this.startCoordinates.x +
        this.blockWidth * (i % 3) +
        this.blockWidth / 2;
      const y =
        this.startCoordinates.y +
        this.blockHeight * Math.floor(i / 3) +
        this.blockHeight / 2;

      this.ctx.beginPath();
      this.ctx.arc(x, y, this.style.helpCircleRadius, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.style.helpCircleFillStyle;
      this.ctx.fill();
    }

    // Draw 0 circle
    const x = this.startCoordinates.x + this.blockWidth + this.blockWidth / 2;
    const y =
      this.startCoordinates.y + this.blockHeight * 3 + this.blockHeight / 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.style.helpCircleRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.style.helpCircleFillStyle;
    this.ctx.fill();
  }

  private getNumberCoordinate(num: number): Coordinates {
    const yIndex = Helpers.lerp(num, 1, 9, 8, 0);

    if (num === 0) {
      return {
        x: this.startCoordinates.x + this.blockWidth + this.blockWidth / 2,
        y:
          this.startCoordinates.y + this.blockHeight * 3 + this.blockHeight / 2,
      };
    }

    return {
      x:
        this.startCoordinates.x +
        this.blockWidth * ((num - 1) % 3) +
        this.blockWidth / 2,
      y:
        this.startCoordinates.y +
        this.blockHeight * Math.floor(yIndex / 3) +
        this.blockHeight / 2,
    };
  }

  private getNumberDirection(
    digit: number,
    prevDigit: number
  ): DirectionVector {
    const coord = this.getNumberCoordinate(digit);
    const prevCoord = this.getNumberCoordinate(prevDigit);

    return {
      x: Math.sign(prevCoord.x - coord.x) ?? 0,
      y: Math.sign(prevCoord.y - coord.y) ?? 0,
    } as DirectionVector;
  }

  private getStartCircleCoordinates(): Coordinates {
    const firstCoord = this.digitsCoordinates[0];
    const secondCoord =
      this.digitsCoordinates.find((coord) => {
        return !Helpers.areCoordinatesEqual(firstCoord, coord);
      }) ?? this.digitsCoordinates[1];

    const vector = Helpers.normalizeVector(
      Helpers.getVector(firstCoord, secondCoord)
    );

    return {
      x: firstCoord.x + vector.x * this.style.sameDirectionLineLength * -1,
      y: firstCoord.y + vector.y * this.style.sameDirectionLineLength * -1,
    };
  }
}
