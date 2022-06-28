// @ts-nocheck
import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import Model from "../../components/testModel";
import { OrbitControls, CycleRaycast, Bounds } from "@react-three/drei";
import { Button, Divider, message, Space } from "antd";
import {
  EffectComposer,
  Outline,
  Select,
  Selection,
} from "@react-three/postprocessing";

interface Position {
  x: number;
  y: number;
}

type HighlighTarget = {
  [item: string]: boolean;
};

const autoConditions = ["Master on", "Home position", "Auto run"];
const AbnormalSignals = ["Motion fault", "Warning", "Cycle stop"];

const Three = () => {
  const [active, setActive] = useState(false);
  const [{ objects, cycle }, set] = useState({ objects: [], cycle: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [menuTarget, setMenuTarget] = useState<string>();
  const [highlightTarget, setHighlightTarget] = useState<HighlighTarget>({});

  useEffect(() => {
    if (objects.length > 0) {
      console.log(objects);
      console.log(cycle);
      // setMenuTarget(objects[cycle]?.object.name);
      setHighlightTarget({ [objects[cycle]?.object.name.split("-")[1]]: true });
    }
  }, [objects, cycle]);

  function onLeaveCanvas() {
    console.log("leave canvas");
    // setShowMenu(false);
    setHighlightTarget({});
  }

  return (
    <div className="three">
      {/* <div>
        <span>{`Mouse on object: ${objects[cycle]?.object.name || "-"}`}</span>
        <span>{`Objects: `}</span>
        {objects.map((obj, idx) => (
          <span key={idx}>{obj.object.name}</span>
        ))}
      </div> */}
      <div className="result">Result</div>
      <div className="operator">
        <div className="setting">Setting</div>
        <div id="canvas-container" className="canvas">
          <Menu show={showMenu} target={menuTarget} setShow={setShowMenu} />
          <Canvas
            orthographic
            camera={{ position: [-3, 3, 3], zoom: 30 }}
            onPointerLeave={() => onLeaveCanvas()}
          >
            <Suspense fallback={<p>Loading ...</p>}>
              <OrbitControls
                makeDefault
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 4}
                enableZoom={true}
                zoomSpeed={0.3}
              />
              <ambientLight intensity={0.1} />
              <directionalLight color={"white"} position={[0, 10, 10]} />
              <Selection>
                <EffectComposer multisampling={0} autoClear={false}>
                  <Outline
                    visibleEdgeColor="white"
                    hiddenEdgeColor="white"
                    blur
                    edgeStrength={1}
                  />
                </EffectComposer>
                <Bounds fit clip observe margin={1}>
                  <Select name={"1"} enabled={highlightTarget["1"]}>
                    <Model
                      position={[-0.5, 0, 1]}
                      unitNo={1}
                      onClick={(e: React.MouseEvent) => {
                        setMenuTarget(objects[cycle]?.object.name);
                      }}
                    />
                  </Select>
                  <Select name={"2"} enabled={highlightTarget["2"]}>
                    <Model
                      position={[1.2, 0, 1]}
                      unitNo={2}
                      onClick={(e: React.MouseEvent) => {
                        setMenuTarget(objects[cycle]?.object.name);
                      }}
                    />
                  </Select>
                </Bounds>
              </Selection>
              <CycleRaycast
                preventDefault={true}
                onChanged={(objects, cycle) => set({ objects, cycle })}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
};

const Menu: FC<> = (props) => {
  const { show, target, setShow } = props;
  const offset = { x: 30, y: -30 };

  const [mouseOver, setMouseOver] = useState(false);

  function onButtonClick(text: string) {
    message.info(`Send signal: ${text} from ${target}`, 3);
  }

  useEffect(() => {
    const menu = document.getElementById("menu");
    // menu?.classList.toggle("show", show);
    menu?.classList.toggle("hide", !show && !mouseOver);
  }, [show, mouseOver]);

  return (
    <div
      id="menu"
      onMouseOver={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <div className="menu-wrapper">
        <p>{`Menu: ${target}`}</p>
        {target != "" && <div className="menu-button">
          <Space>
            {autoConditions.map((cond, idx) => (
              <Button
                key={idx}
                shape="round"
                type="primary"
                onClick={(e) => onButtonClick(cond)}
              >
                {cond}
              </Button>
            ))}
          </Space>
          <Divider />
          <Space>
            {AbnormalSignals.map((cond, idx) => (
              <Button
                key={idx}
                shape="round"
                type="danger"
                onClick={(e) => onButtonClick(cond)}
              >
                {cond}
              </Button>
            ))}
          </Space>
        </div>}
        {/* <div
          id="menu-close"
          onClick={() => {
            console.log("close");
            setShow(false);
            setMouseOver(false);
          }}
        >
          x
        </div> */}
      </div>
    </div>
  );
};

export default Three;
