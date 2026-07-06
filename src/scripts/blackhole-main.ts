import { initBlackHole2D } from './blackhole';
import { initBlackHoleGL } from './blackhole-gl';

const canvas = document.getElementById('blackhole') as HTMLCanvasElement | null;
if (canvas && !initBlackHoleGL(canvas)) initBlackHole2D(canvas);
