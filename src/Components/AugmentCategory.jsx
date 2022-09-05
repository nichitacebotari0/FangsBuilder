import CroppedImage from "./CroppedImage";
import AugmentDescription from "./AugmentDescription";

function AugmentCategory(props) {
    const path = props.dir + props.data.Id + "." + props.data.Name + "/";
    return (
        < div class="flex flex-row p- items-center">
            <For each={props.data.Augments}>
                {(item) =>
                    <button class="basis-1/4 augment" onClick={() => props.click(path + item.IconName)}>
                        <CroppedImage
                            imgbg="bg-black"
                            bg={"bg-" + props.color}
                            image={path + item.IconName}
                            borderSize="28" maxWidth="50"
                            imageSize="26" imageH="48%" imageV="50%" />

                        <div class="augment-tooltip  w-80">
                            <AugmentDescription data={item} />
                        </div>
                    </button>
                }
            </For>
        </div >
    );
}

export default AugmentCategory;