// @ts-nocheck
import React, { useRef } from "react";
import { useGLTF, useAnimations, CycleRaycast } from "@react-three/drei";
import { message } from "antd";
import { useState } from "react";
import { debounce } from "debounce";

export default function Model(props: any) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/basic animation.glb");
  const { actions } = useAnimations(animations, group);
  const { unitNo } = props;
  // console.log(animations);

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      onPointerEnter={() => console.log("enter unitNo", unitNo)}
    >
      <group name="Scene">
        <group name={`Jig-${unitNo}`} position={[0, 1.68, 0.98]} scale={0.33}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube001.geometry}
            material={nodes.Cube001.material}
            position={[0, 0, -0.04]}
            scale={[0.51, 0.15, 0.68]}
          />
        </group>
        <mesh
          name={`Machine-${unitNo}`}
          castShadow
          receiveShadow
          geometry={nodes.Cube.geometry}
          material={materials.Material}
          position={[0, 1.51, 0]}
          scale={[0.8, 1.5, 1.2]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/basic animation.glb");
