from pydantic import BaseSettings


class Settings(BaseSettings):
    ERC20_PORTAL_ADDRESS: str = '0x9c21aeb2093c32ddbc53eef24b873bdcd1ada1db'
    ETHER_PORTAL_ADDRESS: str = '0xffdbe43d4c855bf7e0f105c400a50857f53ab044'
    ADDR_RELAY_ADDRESS: str = '0xf5de34d6bbc0446e2a45719e718efebaae179dae'
    FACTORY_ADDRESS: str = '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f'



settings = Settings()
