import CroppedImage from "./CroppedImage";

function AugmentCategory(props) {
    const path = props.path ?? props.dir +props.data.Id + "." + props.data.Name + "/";
    return (
        < div class="flex flex-row p-2 items-center">
            <For each={props.data.Augments ?? props.data}>
                {(item) =>
                    <div class="basis-1/4 " onClick={() => props.click(path + item.IconName)}>
                        <CroppedImage
                            imgbg="bg-black"
                            bg={"bg-" + props.color}
                            image={path + item.IconName}
                            borderSize="28" maxWidth="50"
                            imageSize="26" imageH="48%" imageV="50%" />
                    </div>
                }
            </For>
        </div >
    );
}

export default AugmentCategory;