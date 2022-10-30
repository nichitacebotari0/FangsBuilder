import AugmentDescription from "./AugmentDescription";
import { Show } from "solid-js";
import { position_tooltip } from "../Utils/Functions";

function AugmentCategory(props) {
    const path = props.dir + props.data.Id + "." + props.data.Name + "/";
    return (
        < div class="flex flex-row p-1 items-center">
            <For each={props.data.Augments}>
                {(item) =>
                    <Show when={item}>
                        <button class="basis-1/4 augment" onClick={() => props.click({ Path: path + item.IconName, Name: item.Name })}
                            onPointerEnter={(e) => position_tooltip(e, ".augment-tooltip")}>
                            <div class={"clip-augment-container inline-block bg-" + props.color + " active:bg-sky-100"}>
                                <img class="clip-augment-image bg-black"
                                    src={path + item.IconName} />
                            </div>

                            <div class="augment-tooltip w-40 md:w-60 lg:w-80">
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