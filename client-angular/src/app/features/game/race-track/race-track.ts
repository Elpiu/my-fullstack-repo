import { AfterViewInit, Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { GameStore } from '../game.store';
import * as THREE from 'three';
import { SocketService } from '../socket.service';
import { CommonModule } from '@angular/common';
import { noop } from 'rxjs';

@Component({
  selector: 'app-race-track',
  imports: [CommonModule],
  templateUrl: './race-track.html',
  styleUrl: './race-track.css',
})
export class RaceTrack implements AfterViewInit {
  @ViewChild('rendererCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  store = inject(GameStore);

  // Three.js refs
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private horseMeshes: Map<string, THREE.Mesh> = new Map();

  constructor() {
    // Sync 3D: Reagisce agli aggiornamenti del server
    effect(() => {
      const horses = this.store.horses();
      this.updateScene(horses);
    });
  }

  ngAfterViewInit() {
    this.initThree();
    this.animate();
  }

  initThree() {
    // Setup Base
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 20, 200);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(-10, 15, 20); // Posizione iniziale

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    // Luci
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    // Pista (Striscia verde lunga)
    const trackGeo = new THREE.PlaneGeometry(2000, 60);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x338f33 });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.rotation.x = -Math.PI / 2;
    track.position.x = 1000;
    track.receiveShadow = true;
    this.scene.add(track);

    // Linea Traguardo
    const finishGeo = new THREE.PlaneGeometry(2, 60);
    const finishMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Checkered sarebbe meglio
    const finishLine = new THREE.Mesh(finishGeo, finishMat);
    finishLine.rotation.x = -Math.PI / 2;
    finishLine.position.x = 1000; // Deve matchare CONSTANTS.FINISH_LINE del server
    finishLine.position.y = 0.1;
    this.scene.add(finishLine);
  }

  updateScene(horses: any[]) {
    // Crea o aggiorna le mesh
    horses.forEach((h, index) => {
      let mesh = this.horseMeshes.get(h.id);

      if (!mesh) {
        // Creiamo un "cavallo" (Cubo + Testa)
        const group = new THREE.Group();

        const bodyGeo = new THREE.BoxGeometry(2, 1.5, 3.5);
        const mat = new THREE.MeshStandardMaterial({ color: h.color });
        const body = new THREE.Mesh(bodyGeo, mat);
        body.position.y = 1.5;
        body.castShadow = true;

        const headGeo = new THREE.BoxGeometry(1, 1, 1.5);
        const head = new THREE.Mesh(headGeo, mat);
        head.position.set(0, 2.5, 1.5); // Un po' in alto e avanti

        group.add(body);
        group.add(head);

        // Posizionamento Corsia
        group.position.z = index * 4 - 20; // Spazia le corsie

        this.scene.add(group);
        //@ts-ignore
        this.horseMeshes.set(h.id, group);
        //@ts-ignore
        mesh = group;
      }

      // Aggiorna posizione X
      // Nota: Per renderlo fluido, qui si potrebbe usare GSAP o lerp
      mesh ? (mesh.position.x = h.position) : noop();
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Camera Follow Logic
    const myId = this.store.myId();
    if (myId && this.horseMeshes.has(myId)) {
      const myHorse = this.horseMeshes.get(myId)!;

      // La camera segue il cavallo ma sfalsata
      const targetX = myHorse.position.x;
      this.camera.position.x = targetX - 15;
      this.camera.position.z = 15;
      this.camera.position.y = 10;
      this.camera.lookAt(targetX + 10, 0, 0);
    }

    this.renderer.render(this.scene, this.camera);
  }

  startSprint() {
    this.store.toggleSprint(true);
  }
  stopSprint() {
    this.store.toggleSprint(false);
  }
}
