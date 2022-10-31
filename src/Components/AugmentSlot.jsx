import { createEffect, Show } from "solid-js";
import getAugmentColor, { position_tooltip } from "../Utils/Functions";
import FlexPicker from "./FlexPicker";



function AugmentSlot(props) {
    return (
        <button class="basis-20 md:basis-40 flexAugment focus:text-sky-300" onClick={() => { props.click() }}
        onPointerEnter={(e) => {  if (props.slot.originalType == "FLEX")  position_tooltip(e, ".flexAugment-picker")}}>
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
                <div class="pl-1 pr-1">{props.slot.text}</div>
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