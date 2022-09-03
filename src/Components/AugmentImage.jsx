import CroppedImage from "./CroppedImage";

function AugmentImage(props) {
  return <div
    onMouseOver={() => { props.setHovered(true); }}
    onMouseOut={() => { props.setHovered(false); }}
  >
    <CroppedImage 
    image={props.image}
    borderSize="34px" borderH="50%" borderV="50%"
    imageSize="30px" imageH="50%" imageV="50%"/>
    <div class=" text-sky-800">{props.title}</div>
  </div>
}

export default AugmentImage;