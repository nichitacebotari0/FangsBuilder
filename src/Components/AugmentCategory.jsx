import CroppedImage from "./CroppedImage";
import AugmentDescription from "./AugmentDescription";
import { Show } from "solid-js";

function AugmentCategory(props) {
    const path = props.dir + props.data.Id + "." + props.data.Name + "/";
    return (
        < div class="flex flex-row p-1 items-center">
            <For each={props.data.Augments}>
                {(item) =>
                    <Show when={item}>
                        <button class="basis-1/4 augment" onClick={() => props.click({ Path: path + item.IconName, Name: item.Name })}>
                            <div class={"clip-augment-container inline-block bg-" + props.color + " active:bg-sky-100"}>
                                <img class="clip-augment-image bg-black"
                                    src={path + item.IconName} />
                            </div>

                            <div class="augment-tooltip w-screen sm:w-4/5 md:w-3/4 lg:w-80">
                                <AugmentDescription data={item} />
                            </div>
                        </button>
                    </Show>
                }
            </For>
        </div >
    );
}

export default AugmentCategory;