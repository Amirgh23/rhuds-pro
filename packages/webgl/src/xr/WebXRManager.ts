import * as THREE from 'three';

export interface WebXRSessionConfig {
  requiredFeatures?: string[];
  optionalFeatures?: string[];
  domOverlay?: { root: HTMLElement };
}

export interface VRControllerState {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  buttons: boolean[];
  axes: number[];
  handedness: 'left' | 'right' | 'none';
}

export interface HandTrackingData {
  joints: Map<string, THREE.Vector3>;
  handedness: 'left' | 'right';
}

export class WebXRManager {
  private renderer: THREE.WebGLRenderer;
  private session: XRSession | null = null;
  private controllers: Map<number, VRControllerState> = new Map();
  private handTracking: Map<number, HandTrackingData> = new Map();
  private sessionCallbacks: {
    onSessionStart?: () => void;
    onSessionEnd?: () => void;
    onControllerUpdate?: (controller: VRControllerState) => void;
    onHandUpdate?: (hand: HandTrackingData) => void;
  } = {};

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
  }

  async startSession(config: WebXRSessionConfig = {}): Promise<XRSession> {
    if (!navigator.xr) {
      throw new Error('WebXR not supported');
    }

    const sessionInit: XRSessionInit = {
      requiredFeatures: config.requiredFeatures || ['local-floor'],
      optionalFeatures: config.optionalFeatures || ['hand-tracking', 'dom-overlay'],
      domOverlay: config.domOverlay,
    };

    try {
      this.session = await navigator.xr.requestSession('immersive-vr', sessionInit);
      this.setupSessionHandlers();
      this.sessionCallbacks.onSessionStart?.();
      return this.session;
    } catch (error) {
      throw new Error(`Failed to start XR session: ${error}`);
    }
  }

  async startARSession(config: WebXRSessionConfig = {}): Promise<XRSession> {
    if (!navigator.xr) {
      throw new Error('WebXR not supported');
    }

    const sessionInit: XRSessionInit = {
      requiredFeatures: config.requiredFeatures || ['hit-test', 'dom-overlay'],
      optionalFeatures: config.optionalFeatures || ['hand-tracking'],
      domOverlay: config.domOverlay,
    };

    try {
      this.session = await navigator.xr.requestSession('immersive-ar', sessionInit);
      this.setupSessionHandlers();
      this.sessionCallbacks.onSessionStart?.();
      return this.session;
    } catch (error) {
      throw new Error(`Failed to start AR session: ${error}`);
    }
  }

  private setupSessionHandlers(): void {
    if (!this.session) return;

    this.session.addEventListener('inputsourceschange', (event: XRInputSourcesChangeEvent) => {
      event.added.forEach((source) => {
        if (source.gamepad) {
          this.setupController(source);
        }
      });

      event.removed.forEach((source) => {
        const index = Array.from(this.session!.inputSources).indexOf(source);
        this.controllers.delete(index);
        this.handTracking.delete(index);
      });
    });

    this.session.addEventListener('end', () => {
      this.session = null;
      this.controllers.clear();
      this.handTracking.clear();
      this.sessionCallbacks.onSessionEnd?.();
    });
  }

  private setupController(source: XRInputSource): void {
    if (!this.session) return;

    const index = Array.from(this.session.inputSources).indexOf(source);
    const state: VRControllerState = {
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      buttons: [],
      axes: [],
      handedness: source.handedness as 'left' | 'right' | 'none',
    };

    this.controllers.set(index, state);
  }

  updateControllers(frame: XRFrame): void {
    if (!this.session) return;

    this.session.inputSources.forEach((source, index) => {
      const state = this.controllers.get(index);
      if (!state) return;

      if (source.gamepad) {
        state.buttons = Array.from(source.gamepad.buttons).map((b) => b.pressed);
        state.axes = Array.from(source.gamepad.axes);
      }

      const pose = frame.getPose(source.gripSpace, frame.session.renderState.baseLayer!.space);
      if (pose) {
        state.position.setFromMatrixPosition(new THREE.Matrix4().fromArray(pose.transform.matrix));
        state.quaternion.setFromRotationMatrix(
          new THREE.Matrix4().fromArray(pose.transform.matrix)
        );
      }

      this.sessionCallbacks.onControllerUpdate?.(state);
    });
  }

  updateHandTracking(frame: XRFrame): void {
    if (!this.session) return;

    this.session.inputSources.forEach((source, index) => {
      if (source.hand) {
        const hand = source.hand;
        const joints = new Map<string, THREE.Vector3>();

        for (const jointName of hand) {
          const joint = hand.get(jointName);
          if (joint) {
            const pose = frame.getJointPose(joint, frame.session.renderState.baseLayer!.space);
            if (pose) {
              const position = new THREE.Vector3();
              position.setFromMatrixPosition(new THREE.Matrix4().fromArray(pose.transform.matrix));
              joints.set(jointName, position);
            }
          }
        }

        const handData: HandTrackingData = {
          joints,
          handedness: source.handedness as 'left' | 'right',
        };

        this.handTracking.set(index, handData);
        this.sessionCallbacks.onHandUpdate?.(handData);
      }
    });
  }

  getController(index: number): VRControllerState | undefined {
    return this.controllers.get(index);
  }

  getHandTracking(index: number): HandTrackingData | undefined {
    return this.handTracking.get(index);
  }

  getAllControllers(): VRControllerState[] {
    return Array.from(this.controllers.values());
  }

  getAllHandTracking(): HandTrackingData[] {
    return Array.from(this.handTracking.values());
  }

  onSessionStart(callback: () => void): void {
    this.sessionCallbacks.onSessionStart = callback;
  }

  onSessionEnd(callback: () => void): void {
    this.sessionCallbacks.onSessionEnd = callback;
  }

  onControllerUpdate(callback: (controller: VRControllerState) => void): void {
    this.sessionCallbacks.onControllerUpdate = callback;
  }

  onHandUpdate(callback: (hand: HandTrackingData) => void): void {
    this.sessionCallbacks.onHandUpdate = callback;
  }

  async endSession(): Promise<void> {
    if (this.session) {
      await this.session.end();
    }
  }

  isSessionActive(): boolean {
    return this.session !== null;
  }

  getSession(): XRSession | null {
    return this.session;
  }

  dispose(): void {
    if (this.session) {
      this.session.end().catch(() => {
        // Ignore errors during disposal
      });
    }
    this.controllers.clear();
    this.handTracking.clear();
  }
}
