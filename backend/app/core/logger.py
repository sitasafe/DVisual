import logging
import sys

def setup_logging():
    logger = logging.getLogger("saas_multimodal")
    logger.setLevel(logging.INFO)
    
    # Produces structured production-ready generic texts
    formatter = logging.Formatter(
        '%(asctime)s | %(name)s | %(levelname)s | %(message)s'
    )
    
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(formatter)
    
    if not logger.handlers:
        logger.addHandler(stream_handler)
        
    return logger

logger = setup_logging()
