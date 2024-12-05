import { icons } from "lucide-react";
import { useState } from "react";
type IconPickerProps = {
  selected: string;
  onIconSelected: (icon: string) => void;
};

type IconName = keyof typeof icons;
const IconPicker: React.FC<IconPickerProps> = ({
  selected,
  onIconSelected,
}) => {
  const [selectedIcon, setSelector] = useState<string>(selected);
  const [searchhText, setSearchText] = useState<string>("");
  const SelectedIconComponent =
    selectedIcon && icons[selectedIcon as IconName]
      ? icons[selectedIcon as IconName]
      : null;
  const IconNames = Object.keys(icons) as IconName[];
  const filteredIconNames: IconName[] = IconNames.filter((iconName) =>
    iconName.toLowerCase().includes(searchhText.toLowerCase())
  );
  const handleIconClick = (iconName: IconName) => {
    setSelector(iconName);
    onIconSelected(iconName);
    (document.getElementById("my_modal_3") as HTMLDialogElement).close();
  };
  return (
    <div>
      <button
        className="btn"
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
      >
        {SelectedIconComponent ? <SelectedIconComponent size={20} /> : null}
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <input
            type="text"
            className="input input-bordered w-full my-4"
            placeholder="Rechercher une icône"
            value={searchhText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="grid grid-cols-6 gap-4">
            {filteredIconNames.map((iconName) => {
              const IconComponent = icons[iconName];
              return (
                <button
                  key={iconName}
                  className={`btn ${
                    selectedIcon === iconName ? "btn-accent" : ""
                  }`}
                  onClick={() => {
                    handleIconClick(iconName);
                  }}
                >
                  {IconComponent ? <IconComponent size={30} /> : null}
                </button>
              );
            })}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default IconPicker;
