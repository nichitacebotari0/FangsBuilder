import { useParams } from "@solidjs/router";
import { createResource } from "solid-js";

async function fetcher(input, { value, refetching }) {
    console.log("fetcher called");
    return  input;
}


function testComponent() {

    const params = useParams();
    const [userData] = createResource(() => params.Hero, fetch);

    return (
        <div class="text-white">
            Hello {params.Hero}
        </div>
    )

}

export default testComponent;