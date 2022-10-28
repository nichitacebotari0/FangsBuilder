import { createEffect, Show } from "solid-js";
import getAugmentColor from "../Utils/Functions";
import CroppedImage from "./CroppedImage";
import FlexPicker from "./FlexPicker";



function AugmentSlot(props) {
    return (
        <button class="basis-40 flexAugment focus:text-sky-300" onClick={() => { props.click() }}>
            <Show when={props.slot.value} fallback={
                <div class={"clip-augment-container inline-block " + getAugmentColor(props.slot.type) + " active:bg-sky-100"}>
                    <img class="clip-augment-image bg-black"
                        src={location.origin + "/Empty.png"} />
                </div>
            }>
                <div class={"clip-augment-container inline-block " + getAugmentColor(props.slot.type) + " active:bg-sky-100"}>
                    <img class="clip-augment-image bg-black"
                        src={props.slot.value} />
                </div>
                <div>{props.slot.text}</div>
            </Show>

            <Show when={props.slot.originalType == "FLEX"}>
                <div class="text-white flexAugment-picker">
                    <FlexPicker click={(c) => {
                        props.slot.type = c;
                        props.click()
                        // setSlots(slots());
                        // setSelectedSlot(3);
                    }} />
                </div>
            </Show>
        </button>
    );
}

export default AugmentSlot;