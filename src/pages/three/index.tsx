// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import Model from "../../components/testModel";
import { OrbitControls, CycleRaycast, Bounds } from "@react-three/drei";
import { Button, Divider, message, Space } from "antd";

interface Position {
  x: number;
  y: number;
}

const autoConditions = ["Master on", "Home position", "Auto run"];
const AbnormalSignals = ["Motion fault", "Warning", "Cycle stop"];

const Three = () => {
  const [active, setActive] = useState(false);
  const [{ objects, cycle }, set] = useState({ objects: [], cycle: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
  const [menuTarget, setMenuTarget] = useState<string>();

  const RotatingBox = () => {
    const myMesh = useRef<Mesh>(null!);
    useFrame(({ clock }) => {
      myMesh.current.rotation.x = clock.getElapsedTime();
    });
    return (
      <mesh
        ref={myMesh}
        onClick={(e) => {
          console.log("click");
          setActive(!active);
        }}
        onContextMenu={(e) => console.log("context menu")}
        onDoubleClick={(e) => console.log("double click")}
        onWheel={(e) => console.log("wheel spin")}
        onPointerUp={(e) => console.log("up")}
        onPointerDown={(e) => console.log("down")}
        onPointerOver={(e) => console.log("over")}
        onPointerOut={(e) => console.log("out")}
        onPointerEnter={(e) => console.log("enter")}
        onPointerLeave={(e) => console.log("leave")}
        onPointerMove={(e) => console.log("move")}
        onPointerMissed={(e) => console.log("miss")}
        onUpdate={(e) => console.log("update")}
        scale={active ? 1.5 : 1}
        rotation={[45, 45, 45]}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={"blue"} />
      </mesh>
    );
  };

  useEffect(() => {
    if (objects.length > 0) {
      console.log(objects);
      console.log(cycle);
      setMenuTarget(objects[cycle]?.object.name);
    }
  }, [objects, cycle]);

  useEffect(() => {
    console.log(showMenu);
  }, [showMenu]);

  return (
    <div className="three">
      Three
      <div>
        <span>{`Mouse on object: ${objects[cycle]?.object.name || "-"}`}</span>
        <span>{`Objects: `}</span>
        {objects.map((obj, idx) => (
          <span key={idx}>{obj.object.name}</span>
        ))}
      </div>
      <div id="canvas-container">
        <Canvas orthographic camera={{ position: [-3, 3, 3], zoom: 50 }}>
          <OrbitControls
            makeDefault
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 4}
            enableZoom={true}
            zoomSpeed={0.3}
          />
          <ambientLight intensity={0.1} />
          <directionalLight color={"white"} position={[0, 10, 10]} />
          <Bounds fit clip observe margin={1}>
            <Model
              position={[-0.5, 0, 1]}
              unitNo={1}
              onClick={(e: React.MouseEvent) => {
                setMenuPosition({ x: e.clientX, y: e.clientY });
                setShowMenu(objects.length > 0);
              }}
            />
            <Model
              position={[1.2, 0, 1]}
              unitNo={2}
              onClick={(e: React.MouseEvent) => {
                setMenuPosition({ x: e.clientX, y: e.clientY });
                setShowMenu(objects.length > 0);
              }}
            />
          </Bounds>
          <CycleRaycast
            preventDefault={true}
            onChanged={(objects, cycle) => set({ objects, cycle })}
          />
        </Canvas>
      </div>
      <Menu
        show={showMenu}
        pos={menuPosition}
        target={menuTarget}
        setShow={setShowMenu}
      />
    </div>
  );
};

const Menu: FC<> = (props) => {
  const {
    show,
    pos: { x, y },
    target,
    setShow,
  } = props;
  const offset = { x: 30, y: -30 };

  function onButtonClick(text: string) {
    message.info(`Send signal: ${text} from ${target}`, 3);
  }

  return (
    <div
      id="menu"
      style={{
        top: y + offset.y,
        left: x + offset.x,
        visibility: show ? "visible" : "hidden",
      }}
    >
      <div className="menu-wrapper">
        <p>{`Menu: ${target}`}</p>
        <div className="menu-button">
          <Space>
            {autoConditions.map((cond) => (
              <Button shape="round" type="primary" onClick={(e) => onButtonClick(cond)}>
                {cond}
              </Button>
            ))}
          </Space>
          <Divider />
          <Space>
            {AbnormalSignals.map((cond) => (
              <Button shape="round" type="danger" onClick={(e) => onButtonClick(cond)}>
                {cond}
              </Button>
            ))}
          </Space>
        </div>
        <div
          id="menu-close"
          onClick={() => {
            console.log("close");
            setShow(false);
          }}
        >
          x
        </div>
      </div>
    </div>
  );
};

export default Three;
