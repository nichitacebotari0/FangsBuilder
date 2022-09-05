function AugmentDescription(props) {
    return (
        <div class="border-white border-2 bg-black">
            <div class="flex flex-col p-2">
                <div class="basis-2/12 border-white border-b-2 font-bold">{props.data.Name}</div>
                <div class="basis-10/12 text-sm">
                    <For each={props.data.Description}>
                        {(item) =>
                            <p>{item}</p>
                        }
                    </For>
                </div>
            </div>
        </div>
    );
}

export default AugmentDescription;