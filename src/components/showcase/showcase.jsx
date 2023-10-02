import { motion } from "framer-motion";

const Showcase = ({ imageUrl, onClose }) => {
  return (
    //only render if imageUrl is not null
    imageUrl && (
      <motion.div
      className="showcase-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <img src={imageUrl} alt="Full Size Artwork" />
    </motion.div>
    )    
  );
};

export default Showcase;
