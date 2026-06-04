import React from "react";

import {
  arrayToMap,
  randomId,
  viewportCoordsToSceneCoords,
} from "@excalidraw/common";
import {
  CaptureUpdateAction,
  getNonDeletedElements,
  getNormalizedDimensions,
  newElementWith,
  newLinearElement,
  selectGroup,
  syncMovedIndices,
} from "@excalidraw/element";
import { pointFrom } from "@excalidraw/math";

import { t } from "../i18n";
import { ToolButton } from "../components/ToolButton";
import { StarIcon } from "../components/icons";

import { register } from "./register";

import type { LocalPoint } from "@excalidraw/math";
import type {
  ExcalidrawLineElement,
  NonDeleted,
} from "@excalidraw/element/types";
import type { AppState } from "../types";

const STAR_RADIUS = 60;

const getStarPoints = (centerX: number, centerY: number) => {
  return Array.from({ length: 5 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;

    return {
      x: centerX + Math.cos(angle) * STAR_RADIUS,
      y: centerY + Math.sin(angle) * STAR_RADIUS,
    };
  });
};

const createStarLine = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  groupId: string,
  appState: Readonly<AppState>,
) => {
  const element = newLinearElement({
    type: "line",
    x: start.x,
    y: start.y,
    points: [
      pointFrom<LocalPoint>(0, 0),
      pointFrom<LocalPoint>(end.x - start.x, end.y - start.y),
    ],
    strokeColor: appState.currentItemStrokeColor,
    backgroundColor: appState.currentItemBackgroundColor,
    fillStyle: appState.currentItemFillStyle,
    strokeWidth: appState.currentItemStrokeWidth,
    strokeStyle: appState.currentItemStrokeStyle,
    roughness: appState.currentItemRoughness,
    opacity: appState.currentItemOpacity,
    groupIds: [groupId],
    locked: false,
  }) as NonDeleted<ExcalidrawLineElement>;

  return newElementWith(element, getNormalizedDimensions(element));
};

export const actionInsertStar = register({
  name: "insertStar",
  label: "toolBar.star",
  icon: StarIcon,
  trackEvent: { category: "toolbar" },
  perform: (elements, appState) => {
    const { x, y } = viewportCoordsToSceneCoords(
      {
        clientX: appState.width / 2 + appState.offsetLeft,
        clientY: appState.height / 2 + appState.offsetTop,
      },
      appState,
    );
    const points = getStarPoints(x, y);
    const groupId = randomId();
    const vertexOrder = [0, 2, 4, 1, 3, 0];
    const starElements = vertexOrder.slice(0, -1).map((vertexIndex, index) =>
      createStarLine(
        points[vertexIndex],
        points[vertexOrder[index + 1]],
        groupId,
        appState,
      ),
    );
    const nextElements = syncMovedIndices(
      [...elements, ...starElements],
      arrayToMap(starElements),
    );

    return {
      elements: nextElements,
      appState: {
        ...appState,
        selectedLinearElement: null,
        ...selectGroup(
          groupId,
          {
            ...appState,
            selectedElementIds: {},
            selectedGroupIds: {},
            editingGroupId: null,
          },
          getNonDeletedElements(nextElements),
        ),
      },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    };
  },
  PanelComponent: ({ updateData }) => (
    <ToolButton
      className="Shape"
      type="button"
      icon={StarIcon}
      title={t("toolBar.star")}
      aria-label={t("toolBar.star")}
      data-testid="toolbar-star"
      onClick={() => updateData(null)}
    />
  ),
});
