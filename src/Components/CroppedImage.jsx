function CroppedImage(props) {
    const minWidth = props.minWidth ? props.minWidth : (parseFloat(props.imageSize) + parseFloat(65));
    const maxWidth = props.maxWidth ?? "";
    const maxHeight = props.maxHeight ?? ""
    return (
        <div class={"clip-hero-container inline-block " + props.bg}
            style={"--crop-size: " + props.borderSize + "px; --crop-h: " + props.imageH + "; --crop-v: " + props.imageV + ";"}>
            <img class={"clip-hero-image " + props.imgbg}
                style={"--crop-size: " + props.imageSize + "px; --crop-h: " + props.imageH + "; --crop-v: " + props.imageV +
                    "; min-width: " + minWidth + "px;" +
                    "; max-width: " + maxWidth + "px;" +
                    "; max-height: " + maxHeight + "px;"}
                src={props.image} />
        </div>
    )
}

export default CroppedImage;