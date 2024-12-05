"use client";
import { useState } from "react";
import IconPicker from "./components/IconPicker";
import Image from "next/image";
import { Download, icons } from "lucide-react";
import ColorPicker from "./components/ColorPicker";
import domtoimage from "dom-to-image";
import confetti from "canvas-confetti";

type IconName = keyof typeof icons;
export default function Home() {
  const [selectedIcon, setSelector] = useState<string>("Apple");
  const SelectedIconComponent =
    selectedIcon && icons[selectedIcon as IconName]
      ? icons[selectedIcon as IconName]
      : null;
  const [iconSize, setIconSize] = useState<number>(200);
  const [radius, setRadius] = useState<number>(12);
  const [iconRotation, setIconRotation] = useState<number>(0);
  const [iconStrokeWidth, setIconStrokeWidth] = useState<number>(3);
  const [shadow, setShadow] = useState<string>("shadow-none");
  const [shadowNumber, setShadowNumber] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"stroke" | "background" | "fill">(
    "stroke"
  );
  const [iconColorStroke, setIconColorStroke] = useState<string>("black");
  const [backgroundColor, setBackgroundColor] = useState<string>("blue");
  const [fillColor, setFillColor] = useState<string>("yellow");
  const handleIconSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconSize(Number(e.target.value));
  };
  const handleIconStrokeWidthChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIconStrokeWidth(Number(e.target.value));
  };
  const handleIconRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconRotation(Number(e.target.value));
  };
  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(e.target.value));
  };
  const getBackgroundStyle = () => {
    return backgroundColor.startsWith("linear-gradient")
      ? { background: backgroundColor }
      : { backgroundColor: backgroundColor };
  };
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadedCompleted, setDownloadedCompleted] =
    useState<boolean>(false);
  const handleShadowNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setShadowNumber(value);
    switch (value) {
      case 25:
        setShadow("shadow-sm");
        break;
      case 50:
        setShadow("shadow-md");
        break;
      case 75:
        setShadow("shadow-lg");
        break;
      case 100:
        setShadow("shadow-xl");
        break;
      default:
        setShadow("shadow-none");
    }
  };
  const handleDownloadImage = (format: "png" | "svg") => {
    setIsDownloading(true);
    setDownloadedCompleted(false);
    const canvas = document.getElementById(
      "iconContainer"
    ) as HTMLCanvasElement;
    if (canvas) {
      let imagePromise;
      if (format === "svg") {
        imagePromise = domtoimage.toSvg(canvas, { bgcolor: undefined });
      } else {
        imagePromise = domtoimage.toPng(canvas, { bgcolor: undefined });
      }
      imagePromise
        .then((dataUrl: string) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `logo.${format}`;
          link.click();

          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 999,
          });
          setIsDownloading(false);
          setDownloadedCompleted(true);
        })
        .catch((error) => {
          console.error("Error downloading image:", error);
          setIsDownloading(false);
        });
    }
  };
  return (
    <div>
      <section className="flex flex-col md:flex-row md:justify-between">
        <div className="md:w-1/4 p-5">
          <div className="flex items-center justify-center space-x-2 mb-4 w-full">
            <button
              className={`btn w-1/3 ${
                activeTab === "stroke" ? "btn-secondary" : ""
              }`}
              onClick={() => setActiveTab("stroke")}
            >
              Bordure
            </button>
            <button
              className={`btn w-1/3 ${
                activeTab === "background" ? "btn-secondary" : ""
              }`}
              onClick={() => setActiveTab("background")}
            >
              Arrière-plan
            </button>
            <button
              className={`btn w-1/3 ${
                activeTab === "fill" ? "btn-secondary" : ""
              }`}
              onClick={() => setActiveTab("fill")}
            >
              Remplissage
            </button>
          </div>
          <div>
            {activeTab === "stroke" && (
              <ColorPicker
                color={iconColorStroke}
                allowGradient={false}
                onColorChange={setIconColorStroke}
              />
            )}
            {activeTab === "background" && (
              <ColorPicker
                color={backgroundColor}
                allowGradient={true}
                onColorChange={setBackgroundColor}
              />
            )}
            {activeTab === "fill" && (
              <ColorPicker
                color={fillColor}
                allowGradient={false}
                onColorChange={setFillColor}
              />
            )}
          </div>
        </div>
        <div className="md:w-2/4 flex justify-center items-center h-screen bg-[url('/file.svg')] bg-cover bg-center border border-base-200 pt-4 relative">
          <div className="flex  items-center justify-between absolute top-0 left-0 bg-base-100 z-50 w-full p-3">
            <div className="flex items-center font-bold italic text-2xl">
              <Image
                src="/logo.png"
                width={500}
                height={500}
                alt="Logo"
                className="w-10"
              />
              <span className="text-secondary ml-2">e</span>Logo
            </div>
            <div className="flex items-center">
              <IconPicker
                onIconSelected={setSelector}
                selected={selectedIcon}
              />
              <button
                className="btn  ml-5"
                onClick={() => {
                  const m = document.getElementById(
                    "my_modal_1"
                  ) as HTMLDialogElement;
                  if (m) {
                    m.showModal();
                    setDownloadedCompleted(false);
                  }
                }}
              >
                Télécharger <Download className="w-4" />
              </button>
            </div>
          </div>
          <div className="bg-neutral-content/10 hover:bg-neutral-content/20 aspect-square border-2 border-base-3000 hover:border-neutral/15 border-dashed p-5 md:p-20">
            <div
              id="iconContainer"
              className={`w-[450px] h-[450px] flex justify-center items-center ${shadow}`}
              style={{ ...getBackgroundStyle(), borderRadius: `${radius}px` }}
            >
              {SelectedIconComponent ? (
                <SelectedIconComponent
                  size={iconSize}
                  style={{
                    strokeWidth: iconStrokeWidth,
                    display: "block",
                    fill: fillColor,
                    stroke: iconColorStroke,
                    transform: `rotate(${iconRotation}deg)`,
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="md:w-1/4 p-5">
          <div className="mt-4">
            <div className="flex justify-between mb-3 text-gray-500">
              <label className="badge badge-ghost"> Taille</label>
              <span>{iconSize}</span>
            </div>
            <div>
              <input
                type="range"
                min="95"
                max="300"
                value={iconSize}
                onChange={handleIconSizeChange}
                className="range range-accent"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-3 text-gray-500">
              <label className="badge badge-ghost"> Bordure</label>
              <span>{iconStrokeWidth} px</span>
            </div>
            <div>
              <input
                type="range"
                min="1"
                max="4"
                value={iconStrokeWidth}
                onChange={handleIconStrokeWidthChange}
                className="range range-accent"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-3 text-gray-500">
              <label className="badge badge-ghost"> Rotation</label>
              <span>{iconRotation} °</span>
            </div>
            <div>
              <input
                type="range"
                min="-180"
                max="180"
                value={iconRotation}
                onChange={handleIconRotationChange}
                className="range range-accent"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-3 text-gray-500">
              <label className="badge badge-ghost"> Ombre</label>
              <span>{shadow.replace("shadow-", "")}</span>
            </div>
            <div>
              <input
                type="range"
                min="0"
                max="100"
                step={25}
                value={shadowNumber}
                onChange={handleShadowNumberChange}
                className="range range-accent"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-3 text-gray-500">
              <label className="badge badge-ghost"> Arrondi</label>
              <span>{radius} px</span>
            </div>
            <div>
              <input
                type="range"
                min="0"
                max="300"
                step={25}
                value={radius}
                onChange={handleRadiusChange}
                className="range range-accent"
              />
            </div>
          </div>
        </div>
      </section>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          {isDownloading ? (
            <div className="flex justify-center items-center">
              <progress className="progress w-full progress-secondary my-20"></progress>
            </div>
          ) : downloadedCompleted ? (
            <div className="text-center my-4">
              <p className="text-md font-bold">
                Le téléchargement a été effectué avec succès !
              </p>
              <button
                className="btn btn-accent"
                onClick={() =>
                  (
                    document.getElementById("my_modal_1") as HTMLDialogElement
                  ).close()
                }
              >
                Fermer
              </button>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-lg text-center mb-4">
                Choisisez un format
              </h3>
              <div className="space-x-3 flex justify-center">
                <button
                  className="btn"
                  onClick={() => handleDownloadImage("png")}
                >
                  PNG
                </button>
                <button
                  className="btn"
                  onClick={() => handleDownloadImage("svg")}
                >
                  SVG
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
