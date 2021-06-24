import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="content">

        <div className="animation">
          <canvas id="myGlCanvas" width="500" height="500"></canvas>
          {/* <!-- <canvas id="myGlCanvas" width="1000" height="1000"></canvas> --> */}
          <div id="fps-counter"> FPS: <span id="fps">--</span></div>
          <div id="satelite-speed"> Speed: <span id="speed">--</span> m/s</div>
          <div id="orbit-radius"> Orbit radius: <span id="circleRadius">--</span> m</div>
          <div id="satelite-period"> Satelite period: <span id="satelitePeriod">--</span> ms</div>
          <div id="orbit-angle"> Orbit angle: <span id="orbitAngle">--</span>&deg;</div>
        </div>

        <p>This annimation is the piece of coursework from up820346</p>
        <p>The satelite period is a result of the speed of the satelite and the radius of the orbit.</p>

        <p>To translate and rotate the earth and satelite model use the following:</p>
        <ul>
          <li>x-trans: shift key plus mouse drag or shift key plus mouse wheel for finer control</li>
          <li>y-trans: alt key plus mouse drag or alt key plus mouse wheel for finer control</li>
          <li>z-trans: mouse wheel</li>
          <li>x-rot: vertical mouse drag</li>
          <li>y-rot: horizontal mouse drag</li>
          <li>z-rot: control key plus vertical mouse drag</li>
        </ul>
        <p>To control this animation use the following:</p>
        <ul>
          <li>Use "arrow up" and "arrow down" to increase or decrease the satelite speed.</li>
          <li>Use "arrow right" and "arrow left" to increase or decrease the satelite orbit radius.</li>
          <li>Use "w" and "s" to increase or decrease the satelite orbit inclination.</li>
        </ul>
        <p>For more control on the animation parameters you can change the following variables values or use the functions provided in the terminal:</p>
        <ul>
          <li>variable "pwgl.sateliteSpeed" controls the satelite speed.</li>
          <li>variable "pwgl.orbitRadius" controls the satelite orbit radius.</li>
          <li>variable "pwgl.orbitInclination" controls the satelite orbit inclination being set in radians</li>
          <li>function "setInclination(angle)" controls the satelite orbit inclination, with the angle in degrees</li>
        </ul>
        <p>Open up a terminal and type <code>startup()</code> to start the animation, will try to make it either automatic or on a button soon.</p>
      </div>
    </div>
  );
}

export default App;
