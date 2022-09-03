import AugmentImage from "./AugmentImage"
import AugmentDescription from "./AugmentDescription"
import { createSignal } from "solid-js";

function Augment(props) {
  const [showTooltip, setshowTooltip] = createSignal(false);
  return (
    <div class= "bg-black">
      <AugmentImage 
      title={props.name}
      setHovered={(b) => setshowTooltip(b)} 
      image={props.image}/>
     
      <Show when={showTooltip()} >
        <AugmentDescription text={props.description} />
      </Show>
    </div>
  );
}

export default Augment;