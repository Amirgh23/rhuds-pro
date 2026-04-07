/**
 * Matrix Math Utilities
 * 3D transformation matrices and operations
 */

export class Matrix {
  /**
   * Create identity matrix
   */
  static identity(): Float32Array {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  /**
   * Create translation matrix
   */
  static translation(x: number, y: number, z: number): Float32Array {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
  }

  /**
   * Create scale matrix
   */
  static scale(x: number, y: number, z: number): Float32Array {
    return new Float32Array([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
  }

  /**
   * Create rotation matrix around X axis
   */
  static rotationX(angle: number): Float32Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
  }

  /**
   * Create rotation matrix around Y axis
   */
  static rotationY(angle: number): Float32Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  }

  /**
   * Create rotation matrix around Z axis
   */
  static rotationZ(angle: number): Float32Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  /**
   * Create perspective projection matrix
   */
  static perspective(fov: number, aspect: number, near: number, far: number): Float32Array {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    return new Float32Array([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (far + near) * nf,
      -1,
      0,
      0,
      2 * far * near * nf,
      0,
    ]);
  }

  /**
   * Create orthographic projection matrix
   */
  static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Float32Array {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);

    return new Float32Array([
      -2 * lr,
      0,
      0,
      0,
      0,
      -2 * bt,
      0,
      0,
      0,
      0,
      2 * nf,
      0,
      (left + right) * lr,
      (top + bottom) * bt,
      (far + near) * nf,
      1,
    ]);
  }

  /**
   * Create look-at matrix
   */
  static lookAt(
    eye: [number, number, number],
    center: [number, number, number],
    up: [number, number, number]
  ): Float32Array {
    const z = this.normalize([eye[0] - center[0], eye[1] - center[1], eye[2] - center[2]]);

    const x = this.normalize(this.cross(up, z));
    const y = this.cross(z, x);

    return new Float32Array([
      x[0],
      y[0],
      z[0],
      0,
      x[1],
      y[1],
      z[1],
      0,
      x[2],
      y[2],
      z[2],
      0,
      -this.dot(x, eye),
      -this.dot(y, eye),
      -this.dot(z, eye),
      1,
    ]);
  }

  /**
   * Multiply two matrices
   */
  static multiply(a: Float32Array, b: Float32Array): Float32Array {
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[i * 4 + k] * b[k * 4 + j];
        }
        result[i * 4 + j] = sum;
      }
    }

    return result;
  }

  /**
   * Transpose matrix
   */
  static transpose(m: Float32Array): Float32Array {
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[j * 4 + i] = m[i * 4 + j];
      }
    }

    return result;
  }

  /**
   * Invert matrix
   */
  static invert(m: Float32Array): Float32Array {
    const result = new Float32Array(16);

    const m00 = m[0],
      m01 = m[1],
      m02 = m[2],
      m03 = m[3];
    const m10 = m[4],
      m11 = m[5],
      m12 = m[6],
      m13 = m[7];
    const m20 = m[8],
      m21 = m[9],
      m22 = m[10],
      m23 = m[11];
    const m30 = m[12],
      m31 = m[13],
      m32 = m[14],
      m33 = m[15];

    const b00 = m00 * m11 - m01 * m10;
    const b01 = m00 * m12 - m02 * m10;
    const b02 = m00 * m13 - m03 * m10;
    const b03 = m01 * m12 - m02 * m11;
    const b04 = m01 * m13 - m03 * m11;
    const b05 = m02 * m13 - m03 * m12;
    const b06 = m20 * m31 - m21 * m30;
    const b07 = m20 * m32 - m22 * m30;
    const b08 = m20 * m33 - m23 * m30;
    const b09 = m21 * m32 - m22 * m31;
    const b10 = m21 * m33 - m23 * m31;
    const b11 = m22 * m33 - m23 * m32;

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return result;
    }

    det = 1 / det;

    result[0] = (m11 * b11 - m12 * b10 + m13 * b09) * det;
    result[1] = (m02 * b10 - m01 * b11 - m03 * b09) * det;
    result[2] = (m31 * b05 - m32 * b04 + m33 * b03) * det;
    result[3] = (m12 * b04 - m11 * b05 - m13 * b03) * det;
    result[4] = (m12 * b08 - m10 * b11 - m13 * b07) * det;
    result[5] = (m00 * b11 - m02 * b08 + m03 * b07) * det;
    result[6] = (m32 * b02 - m30 * b05 - m33 * b01) * det;
    result[7] = (m10 * b05 - m12 * b02 + m13 * b01) * det;
    result[8] = (m10 * b10 - m11 * b08 + m13 * b06) * det;
    result[9] = (m01 * b08 - m00 * b10 - m03 * b06) * det;
    result[10] = (m30 * b04 - m31 * b02 + m33 * b00) * det;
    result[11] = (m11 * b02 - m10 * b04 - m13 * b00) * det;
    result[12] = (m11 * b07 - m10 * b09 - m12 * b06) * det;
    result[13] = (m00 * b09 - m01 * b07 + m02 * b06) * det;
    result[14] = (m31 * b01 - m30 * b03 - m32 * b00) * det;
    result[15] = (m10 * b03 - m11 * b01 + m12 * b00) * det;

    return result;
  }

  /**
   * Vector operations
   */
  static normalize(v: number[]): number[] {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (len === 0) return v;
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  static cross(a: number[], b: number[]): number[] {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }

  static dot(a: number[], b: number[]): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  static add(a: number[], b: number[]): number[] {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  static subtract(a: number[], b: number[]): number[] {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  static scale(v: number[], s: number): number[] {
    return [v[0] * s, v[1] * s, v[2] * s];
  }

  static length(v: number[]): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }
}

export default Matrix;
