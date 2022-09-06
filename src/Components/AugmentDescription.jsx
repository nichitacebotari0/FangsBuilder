function AugmentDescription(props) {
    return (
        <div class="border-white border-2 bg-black">
            <div class="flex flex-col p-2">
                <div class="basis-2/12 border-gray-300 border-b-2 font-bold">{props.data.Name}</div>
                <div class="basis-10/12 text-sm">
                    <div class="flex flex-col">
                    <For each={props.data.Description}>
                        {(item) =>
                            <div>{item}</div>
                        }
                    </For>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AugmentDescription;