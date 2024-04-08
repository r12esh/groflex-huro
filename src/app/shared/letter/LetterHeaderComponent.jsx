import React, { useEffect, useRef, useState } from "react";
import q from "q";
import { fabric } from "fabric";
import { FeatherIcon } from "../featherIcon/FeatherIcon";
import groflexService from "../../services/groflex.service";
import resources from "../resources/resources";
import config from "../../../../oldConfig";
import { Button } from "../components/button/Button";
import _ from "lodash";
import LetterHeaderState from "../../enums/letter/letter-header-state.enum";
import {
  LetterFabricText,
  fabricObjectToImageLetterElement,
  fabricObjectToShapeLetterElement,
  fabricObjectToTextLetterElement,
  letterElementsToFabricObjects,
} from "../../helpers/letterHeaderHelpers";
import CanvasColorPickerComponent from "../canvasColorPicker/CanvasColorPickerComponent";
import OnClickOutside from "../components/onClickOutside/OnClickOutside";
import LoaderSpinner from "../components/loaderSpinner/LoaderSpinner";
import { ButtonAddons } from "../components/button/btn-addons/ButtonAddons";

const DEFAULT_FONT_SIZE = 18;
const KEY_CODES = config.KEY_CODES;

const SHIFT_STEP = 10;
// const CANVAS_WIDTH = 937;
const CANVAS_WIDTH = 725;
const CANVAS_HEIGHT = 198;
const OFFSET = 0;
const CANVAS_ZINDEX_OFFSET = 3;
const BOUNDING_BOX = {
  left: OFFSET,
  top: OFFSET,
  width: CANVAS_WIDTH - OFFSET * 2,
  height: CANVAS_HEIGHT - OFFSET * 2,
};
const CENTER = {
  x: BOUNDING_BOX.left + BOUNDING_BOX.width / 2,
  y: BOUNDING_BOX.top + BOUNDING_BOX.height / 2,
};
const H_SNAP_POINTS = [OFFSET, CENTER.y, CANVAS_WIDTH - OFFSET, CENTER.y];
const V_SNAP_POINTS = [CENTER.x, OFFSET, CENTER.x, CANVAS_HEIGHT - OFFSET];

const LetterHeaderComponent = ({ items, onFinish }) => {
  //
  const [canvasEditMode, setCanvasEditMode] = useState();
  // const [colorPicker, setImageUrl] = useState();
  const [selectedObject, setSelectedObject] = useState();
  const [letterHeaderStates, setLetterHeaderStates] = useState({
    items,
    headerState:
      items?.length > 0 ? LetterHeaderState.DISPLAY : LetterHeaderState.EMPTY,
    loading: false,
    deleteButtonActive: false,
    textSelected: false,
    canHaveColor: false,
    hSnapVisible: false,
    vSnapVisible: false,
    wrapperVisible: false,
    textIsBold: false,
    textIsItalic: false,
    textIsUnderlined: false,
    textSupportsBold: false,
    textSupportsItalic: false,
    selectedFontSize: undefined,
    selectedFont: undefined,
    selectedFontColor: undefined,
    previousEl: undefined,
    fabricObjects: [],
  });

  //Refs

  const otherRefs = useRef({
    uploader: undefined,
    hSnap: undefined,
    fonts: config.letter.fonts,
    whenImageUploaded: q.defer(),
    isSaving: false,
    hasAddedText: false,
    addedTextAdditionalTop: 0,
    addedTextAdditionalLeft: 0,
  });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  //Initializing empty canvas
  useEffect(() => {
    initializeFabricCanvas();
  }, []);

  //Effect for filling canvas elements from props
  useEffect(() => {
    if (letterHeaderStates.items?.length) {
      getContentForCanvas();
    }
  }, [letterHeaderStates.items]);

  const initializeFabricCanvas = () => {
    setLetterHeaderStates({ ...letterHeaderStates, loading: true });
    if (canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        selection: false,
        height: CANVAS_HEIGHT,
        width: CANVAS_WIDTH,
        uniformScaling: true,
      });
      const lineOptions = {
        stroke: "#ddd",
        fill: "transparent",
        selectable: false,
        opacity: 0,
      };
      const wrapperOptions = Object.assign({}, BOUNDING_BOX, lineOptions);
      // Hack: Show border from wrapper container (Canvas renders 0.5 pixels)
      wrapperOptions.width--;
      wrapperOptions.height--;
      const snapOptions = Object.assign(
        {},
        { strokeDashArray: [5] },
        lineOptions
      );
      const wrapper = new fabric.Rect(wrapperOptions);
      const vSnap = new fabric.Line(V_SNAP_POINTS, snapOptions);
      const hSnap = new fabric.Line(H_SNAP_POINTS, snapOptions);
      newCanvas
        .add(wrapper, hSnap, vSnap)
        .on("selection:updated", handleSelection)
        .on("selection:created", handleSelection)
        .on("selection:cleared", handleDeSelection)
        .on("object:moving", onCanvasObjectMoving);
      // .on("object:selected", handleSelection)

      canvasRef.current = newCanvas;

      if (!items.length) {
        setLetterHeaderStates({ ...letterHeaderStates, loading: false });
      }

      return () => {
        document.removeEventListener("keydown", onDocumentKeydown);
        // groflexService.off("keydown", onDocumentKeydown);
        newCanvas.removeListeners();
        newCanvas.dispose();
      };
    }
  };

  const onDocumentKeydown = (event) => {
    const canvas = canvasRef.current;

    const { keyCode } = event;
    const obj = canvas?.getActiveObject();
    if (keyCode === KEY_CODES.ESCAPE) {
      return onEscapePress();
    }
    if (!obj) {
      return;
    }
    switch (keyCode) {
      case KEY_CODES.ENTER:
        if (obj instanceof fabric.IText) {
          obj.enterEditing().selectAll();
          event.preventDefault();
        }
        break;
      case KEY_CODES.DELETE:
        removeSelectedObjectFromCanvas();
        break;
      case KEY_CODES.LEFT:
        obj.left -= event.shiftKey ? SHIFT_STEP : 1;
        break;
      case KEY_CODES.TOP:
        obj.top -= event.shiftKey ? SHIFT_STEP : 1;
        break;
      case KEY_CODES.RIGHT:
        obj.left += event.shiftKey ? SHIFT_STEP : 1;
        break;
      case KEY_CODES.DOWN:
        obj.top += event.shiftKey ? SHIFT_STEP : 1;
        break;
      case KEY_CODES.BACKSPACE:
        removeSelectedObjectFromCanvas();
    }
    obj.setCoords();
    canvas.renderAll();
  };

  const onEscapePress = () => {
    setLetterHeaderStates({
      ...letterHeaderStates,
      headerState:
        this.state.items.length > 0
          ? LetterHeaderState.DISPLAY
          : LetterHeaderState.EMPTY,
    });
    exitEditMode();
  };

  const getContentForCanvas = () => {
    letterElementsToFabricObjects(letterHeaderStates.items).then(
      (fabricObjects) => {
        setLetterHeaderStates({ ...letterHeaderStates, fabricObjects });
        addFabricObjectsToCanvas(fabricObjects);
      }
    );
  };

  const addFabricObjectsToCanvas = (fabricObjects) => {
    const canvas = canvasRef.current;
    fabricObjects.forEach((fabricObject) => {
      // console.log(fabricObject, "FABRIC OBJECT ");
      canvas.insertAt(fabricObject, fabricObject._sortId, false);
    });
    canvas.renderAll();
    setLetterHeaderStates({ ...letterHeaderStates, loading: false });
  };

  const handleUploadBtnClick = () => {
    fileInputRef.current.click();
  };

  const handleImageInput = (event) => {
    let imageUrl;
    const canvas = canvasRef.current;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        canvas.getObjects("image").forEach((img) => {
          img.setSrc("");
          canvas.remove(img);
        });
        imageUrl = e.target.result;
        fabric.Image.fromURL(imageUrl, (image) => {
          image.scaleToHeight(158);
          image.lockUniScaling = true;
          image.lockSkewingX = true;
          image.lockSkewingY = true;
          image.lockRotation = true;
          image.hasRotatingPoint = false;
          image.selectable = true;
          image._sortId = 3;
          console.log(
            image.getScaledHeight(),
            image.getScaledWidth(),
            image._sortId,
            image._getLeftTopCoords(),

            "FROM OM READ"
          );
          // image.cornerColor = "#5a9ff5";
          // image.lockScalingFlip = true;
          // image.minScaleLimit = 0.25;
          // image.padding = 10;
          // image.strokeWidth = 0;
          // image.transparentCorners = false;

          canvas.insertAt(image, 3, true);
          canvas.centerObject(image);
          // canvas.setActiveObject(canvas.item(image._sortId));
          // canvas.renderAll();
          // adjustImage(image);
        });
      };
    }
  };

  const adjustImage = (image) => {
    const canvas = canvasRef.current;
    const maxWidth = CANVAS_WIDTH - OFFSET * 2 - 40;
    const maxHeight = CANVAS_HEIGHT - OFFSET * 2 - 40;

    if (image.width > maxWidth || image.height > maxHeight) {
      const fitToWidth = image.width / maxWidth > image.height / maxHeight;
      image
        .set({
          width: fitToWidth
            ? maxWidth
            : (image.width / image.height) * maxHeight,
          height: fitToWidth
            ? (image.height / image.width) * maxWidth
            : maxHeight,
        })
        .setCoords();
    }

    image
      .set({
        left: (CANVAS_WIDTH - image.width) / 2,
        top: (CANVAS_HEIGHT - image.height) / 2,
      })
      .setCoords();

    canvas.renderAll();
  };

  const handleSelection = (event) => {
    const canvas = canvasRef.current;
    const activeObject = canvas.getActiveObject();

    if (activeObject.type === "i-text") {
      setLetterHeaderStates({ ...letterHeaderStates, textSelected: true });
    }

    console.log("SELECTED object", activeObject);
    setSelectedObject(activeObject);
    setCanvasEditMode(true);
  };

  const handleDeSelection = (event) => {
    setSelectedObject(null);
    setLetterHeaderStates({ ...letterHeaderStates, textSelected: false });
  };

  const onCanvasObjectMoving = (obj) => {
    // restrict objects on canvas so they don't move out of the boundingBox and snap them
    // to the horizontal and vertical centers.

    const object = obj.target;
    object.set({
      padding: 0,
      // backgroundColor: "rgba(255, 255, 255, 0.7)",
    });

    // snap to center
    const center = object.getCenterPoint();
    const threshold = 8;
    const snapX = _.inRange(
      center.x,
      CENTER.x - threshold,
      CENTER.x + threshold
    );
    const snapY = _.inRange(
      center.y,
      CENTER.y - threshold,
      CENTER.y + threshold
    );
    setLetterHeaderStates({
      ...letterHeaderStates,
      hSnapVisible: snapY,
      vSnapVisible: snapX,
      wrapperVisible: true,
    });
    object.setPositionByOrigin(
      new fabric.Point(
        snapX ? CENTER.x : center.x,
        snapY ? CENTER.y : center.y
      ),
      "center",
      "center"
    );
  };

  const handleAddTextToCanvas = () => {
    const canvas = canvasRef.current;
    const canvasCenterTop = CANVAS_HEIGHT / 2;
    const canvasCenterLeft = CANVAS_WIDTH / 2;

    let fabricObjects = canvas.getObjects();
    fabricObjects = fabricObjects.slice(CANVAS_ZINDEX_OFFSET);

    const textElements = fabricObjects.reduce((textElementList, obj, index) => {
      const objectType = obj.get("type");

      if (objectType === "i-text" && !obj._letterElementId) {
        textElementList.push(obj);
      }

      return textElementList;
    }, []);

    const font = _.find(otherRefs.current.fonts, { default: true });

    const defaultOptions = {
      fontFamily: font.name,
      fontSize: DEFAULT_FONT_SIZE,
      fontStyle: "normal",
      fontWeight: font.regular,
      left: canvasCenterLeft,
      top: canvasCenterTop,
      lockScalingX: true,
      lockScalingY: true,
      hasControls: false,
    };

    const fabricTextOptions = _.assign(
      {},
      defaultOptions,
      config.letter.fabricOptions
    );
    const text = new LetterFabricText(
      resources.str_yourText,
      fabricTextOptions
    );

    if (otherRefs.current.hasAddedText && textElements.length <= 29) {
      otherRefs.current.addedTextAdditionalTop = textElements.length * 10;
      otherRefs.current.addedTextAdditionalLeft = textElements.length * 10;

      if (textElements.length >= 27) {
        otherRefs.current.addedTextAdditionalTop =
          textElements.length * 10 - 27 * 10;
      } else if (textElements.length >= 18) {
        otherRefs.current.addedTextAdditionalTop =
          textElements.length * 10 - 18 * 10;
      } else if (textElements.length >= 9) {
        otherRefs.current.addedTextAdditionalTop =
          textElements.length * 10 - 9 * 10;
      }
    }

    otherRefs.current.hasAddedText = true;

    text.top -= text.height / 2 - otherRefs.current.addedTextAdditionalTop;
    text.left -= text.width / 2 - otherRefs.current.addedTextAdditionalLeft;

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing().selectAll();
  };

  const removeSelectedObjectFromCanvas = () => {
    const canvas = canvasRef.current;
    const activeObject = canvas.getActiveObject();
    // canvas.remove(selectedElement);
    canvas.remove(activeObject);
    // console.log(activeObject, "DELETE Active object");

    canvas.renderAll();
  };

  const handleClearALlElements = () => {
    canvasRef.current.clear();
  };

  const exitEditMode = () => {
    if (!canvasEditMode) return;
    console.log("EXIT EDIT MODE");
    const canvas = canvasRef.current;
    canvas.discardActiveObject();
    canvas.renderAll();
    setCanvasEditMode(false);
    document.removeEventListener("keydown", onDocumentKeydown);
    // groflexService.on("keydown", onDocumentKeydown);
  };

  const enterEditMode = () => {
    if (canvasEditMode) return;
    console.log("ENTERED EDIT MODE");
    document.addEventListener("keydown", onDocumentKeydown);
    // groflexService.on("keydown", onDocumentKeydown);
    setCanvasEditMode(true);
  };

  const saveLetterElements = () => {
    const canvas = canvasRef.current;
    let fabricObjects = canvas.getObjects();
    fabricObjects = fabricObjects.slice(CANVAS_ZINDEX_OFFSET);
    const parsedFabrics = parseFabricObjects(fabricObjects);

    createImages().then((letterImage) => {
      if (letterImage) {
        parsedFabrics.push(letterImage);
      }

      letterElementsToFabricObjects(parsedFabrics).then((fabricObjects) => {
        onFinish(parsedFabrics);
        setLetterHeaderStates({
          ...letterHeaderStates,
          fabricObjects,
          items: parsedFabrics,
          headerState:
            parsedFabrics.length > 0
              ? LetterHeaderState.DISPLAY
              : LetterHeaderState.EMPTY,
        });
      });
    });
  };

  const parseFabricObjects = (fabricObjects) => {
    const letterElements = fabricObjects.reduce(
      (letterElementList, obj, index) => {
        const letterElementModel = obj._letterElementId
          ? letterHeaderStates.items.find((item) => {
              return item.id === obj._letterElementId;
            })
          : undefined;
        obj._sortId = index + CANVAS_ZINDEX_OFFSET;

        const objectType = obj.get("type");

        switch (objectType) {
          case "image":
            if (!letterElementModel) {
              return letterElementList;
            }
            const imageElement = fabricObjectToImageLetterElement(
              obj,
              letterElementModel
            );
            letterElementList.push(imageElement);
            break;
          case "i-text":
            const textElement = fabricObjectToTextLetterElement(
              obj,
              letterElementModel
            );
            letterElementList.push(textElement);
            break;
          case "rect":
            const rectangleElement = fabricObjectToShapeLetterElement(
              obj,
              letterElementModel
            );
            letterElementList.push(rectangleElement);
            break;
        }
        return letterElementList;
      },
      []
    );

    return letterElements;
  };

  const createImages = () => {
    if (prepareImageUploads()) {
      otherRefs.current.uploader.uploadStoredFiles();
    } else {
      otherRefs.current.whenImageUploaded.resolve();
    }
    return otherRefs.current.whenImageUploaded.promise;
  };

  //Font formatting components
  const FontTools = () => {
    const canvas = canvasRef.current;
    const activeObj = canvas?.getActiveObject();
    let disabled;
    if (activeObj?.type !== "i-text") {
      disabled = true;
    }
    const isBold = activeObj?.fontWeight === "700";
    const isItalics = activeObj?.fontStyle === "italic";
    const isUnderline = activeObj?.underline;
    // console.log(isBold, isUnderline, isItalics);

    const setBold = () => {
      if (isBold) {
        activeObj.set({ fontWeight: "400" });
        setLetterHeaderStates({ ...letterHeaderStates, textIsBold: false });
      } else {
        activeObj.set({ fontWeight: "700" });
        setLetterHeaderStates({ ...letterHeaderStates, textIsBold: true });
      }
      canvas.renderAll();
    };

    const setUnderline = () => {
      if (isUnderline) {
        activeObj.set({ underline: false, textDecoration: "" });
        setLetterHeaderStates({
          ...letterHeaderStates,
          textIsUnderlined: false,
        });
      } else {
        activeObj.set({ underline: true, textDecoration: "underline" });
        setLetterHeaderStates({
          ...letterHeaderStates,
          textIsUnderlined: true,
        });
      }
      canvas.renderAll();
    };

    const setItalic = () => {
      if (isItalics) {
        activeObj.set({
          fontStyle: "normal",
        });
        setLetterHeaderStates({ ...letterHeaderStates, textIsItalic: true });
      } else {
        activeObj.set({
          fontStyle: "italic",
        });
        setLetterHeaderStates({ ...letterHeaderStates, textIsItalic: false });
      }
      canvas.renderAll();
    };

    const handleColorPickerChange = (color) => {
      // console.log(color.target.value);

      activeObj.set({
        fill: color.target.value,
      });
      // setLetterHeaderStates({
      //   ...letterHeaderStates,
      //   selectedFontColor: color.target.value,
      // });
      canvas.renderAll();
    };

    return (
      <div className="font-tool-btns flex-row">
        <ButtonAddons>
          <p className="control">
            <Button
              onClick={setBold}
              // isPrimary={isBold}
              // isOutlined={isBold}
              isSecondary={isBold}
              isDisabled={disabled}
            >
              <div className="font-18px font-bold">B</div>
            </Button>
          </p>
          <p className="control">
            <Button
              onClick={setUnderline}
              // isPrimary={isUnderline}
              // isOutlined={isUnderline}
              isSecondary={isUnderline}
              isDisabled={disabled}
            >
              <div className="font-18px text-underline">U</div>
            </Button>
          </p>
          <p className="control">
            <Button
              onClick={setItalic}
              // isPrimary={isItalics}
              isSecondary={isItalics}
              isDisabled={disabled}
            >
              <div className="font-18px font-italic">i</div>
            </Button>
          </p>
        </ButtonAddons>
        <div className="display-flex m-l-10">
          <input
            style={{
              width: "45px",
              height: "38px",
              backgroundColor: "none",
            }}
            type="color"
            value={activeObj?.fill}
            onChange={handleColorPickerChange}
            disabled={disabled}
          />
        </div>
      </div>
    );
  };

  // console.log(letterHeaderStates.fabricObjects, "FABRIC OBJECTS AFTER CONVERT");
  // console.log(letterHeaderStates.items, "LETTER RAW ITEMS FROM STATE");
  // console.log(canvasRef?.current?.getObjects("image"), "GET IMAGE ALL OBJECTS");
  // console.log(canvasRef?.current?.getObjects("i-text"), "GET TEXT ALL OBJECTS");
  // console.log(selectedObject, "SELECTEDS");
  // console.log(letterHeaderStates.textSelected, "TEXT SELECTEDS");

  return (
    <OnClickOutside
      onClickOutside={exitEditMode}
      onCLickInside={enterEditMode}
      className={`letter-header-component`}
    >
      <input
        ref={fileInputRef}
        className="is-hidden"
        type="file"
        accept="image/jpg,image/jpeg,image/png"
        onChange={handleImageInput}
      />
      <div
        className={`header-edit-container ${
          canvasEditMode ? "header-edit-active" : "header-edit-inactive"
        }`}
      >
        <FeatherIcon
          name={"Edit"}
          className={"header-edit-icon"}
          primaryColor
        />

        <LoaderSpinner
          containerStyle={{ position: "absolute" }}
          visible={letterHeaderStates.loading}
          message={"Loading canvas"}
          size="30"
        />
        <canvas
          style={{ cursor: !canvasEditMode && "pointer" }}
          ref={canvasRef}
        />
      </div>
      <div
        className={`canvas-action-buttons m-t-10 ${
          !canvasEditMode && "is-hidden"
        }`}
      >
        <div className="letter-header-font-tools">
          <FontTools />
        </div>
        <div className="canvas-tools m-t-10">
          <Button isSecondary onClick={handleUploadBtnClick}>
            Upload Logo
          </Button>
          <Button
            className={"m-l-10"}
            isSecondary
            onClick={handleAddTextToCanvas}
          >
            Text
          </Button>
          <Button
            className={"m-l-10"}
            isSecondary
            onClick={handleClearALlElements}
          >
            Clear all elements
          </Button>
          <Button
            className={"m-l-10"}
            isSecondary={selectedObject}
            isDisabled={!selectedObject}
            onClick={removeSelectedObjectFromCanvas}
          >
            Delete
          </Button>
        </div>
      </div>
    </OnClickOutside>
  );
};

export default LetterHeaderComponent;
