import { createEffect, Show } from "solid-js";
import getAugmentColor, { position_tooltip } from "../Utils/Functions";
import AugmentDescription from "./AugmentDescription";
import FlexPicker from "./FlexPicker";



function AugmentSlot(props) {
    return (
        <button class="basis-20 md:basis-40 augment focus:text-sky-300" onClick={() => { props.click() }}
            onPointerEnter={(e) => { position_tooltip(e, ".augment-tooltip") }}>
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
                <div class="text-white augment-tooltip">
                    <FlexPicker click={(c) => {
                        props.slot.type = c;
                        props.click()
                        // setSlots(slots());
                        // setSelectedSlot(3);
                    }} />
                </div>
            </Show>

            <Show when={props.slot.description !== ""}>
                <div class="augment-tooltip w-40 md:w-60 lg:w-80 text-sky-50">
                    <AugmentDescription data={{ Name: props.slot.text, Description: props.slot.description }} />
                </div>
            </Show>
        </button>
    );
}

export default AugmentSlot;