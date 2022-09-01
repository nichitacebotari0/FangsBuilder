import AugmentImage from "../../AugmentImage"
import AugmentDescription from "../../AugmentDescription"

function AltarOfPain() {
  const imageprefix = './Images/Augments/positionals/';
  const [showTooltip, setshowTooltip] = createSignal(false);
  return (
      <div >
        <AugmentImage image={imageprefix + "1. captain killer/1. altar.png"}
        // onMouseOver={setshowTooltip(true)}
        // onMouseOut={setshowTooltip(false)}
        />
          <AugmentDescription text="Hello"/>
      </div>
    );
}

export default AltarOfPain;