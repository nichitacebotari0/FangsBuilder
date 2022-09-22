import CroppedImage from "./CroppedImage";
import AugmentDescription from "./AugmentDescription";
import { Show } from "solid-js";

function AugmentCategory(props) {
    const path = props.dir + props.data.Id + "." + props.data.Name + "/";
    return (
        < div class="flex flex-row p- items-center">
            <For each={props.data.Augments}>
                {(item) =>
                    <Show when={item}>
                        <button class="basis-1/4 augment" onClick={() => props.click({ Path: path + item.IconName, Name: item.Name })}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg={"bg-" + props.color}
                                image={path + item.IconName}
                                borderSize="28" maxWidth="50"
                                imageSize="26" imageH="48%" imageV="50%" />

                            <div class="augment-tooltip w-20 sm:w-32 md:w-56 lg:w-80">
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