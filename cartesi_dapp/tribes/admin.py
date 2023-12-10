from pydantic import BaseModel
from cartesi import (
    abi,
    ABIRouter,
    ABIFunctionSelectorHeader,
    Rollup,
    RollupData
)

from . import tribe_factory

adminrouter = ABIRouter()

ADMINS = set()


def _is_admin(addr: str) -> bool:
    """Return True if given address is an admin for the DApp

    Parameters
    ----------
    addr : str
        Wallet address to test

    Returns
    -------
    bool
        True if address is an admin
    """
    return addr.lower() in ADMINS


def _add_admin(addr: str) -> None:
    """Add an address to the admin list

    Parameters
    ----------
    addr : str
        Address to add
    """
    ADMINS.add(addr.lower())


def _remove_admin(addr: str) -> None:
    """Remove an address from the admin list

    Parameters
    ----------
    addr : str
        Address to remove
    """
    ADMINS.remove(addr.lower())


class AddressInput(BaseModel):
    addr: abi.Address


@adminrouter.advance(
    header=ABIFunctionSelectorHeader(
        function='add_admin',
        argument_types=['address']
    )
)
def add_admin(rollup: Rollup, data: RollupData):
    # Check if caller is an admin
    if not _is_admin(data.metadata.msg_sender):
        # Fail advance
        return False
    # Get payload without header
    payload_bytes = data.bytes_payload()[4:]
    payload = abi.decode_to_model(payload_bytes, AddressInput)
    _add_admin(payload.addr)
    return True


@adminrouter.advance(
    header=ABIFunctionSelectorHeader(
        function='remove_admin',
        argument_types=['address']
    )
)
def remove_admin(rollup: Rollup, data: RollupData):
    # Check if caller is an admin
    if not _is_admin(data.metadata.msg_sender):
        # Fail advance
        return False
    # Get payload without header
    payload_bytes = data.bytes_payload()[4:]
    payload = abi.decode_to_model(payload_bytes, AddressInput)
    _remove_admin(payload.addr)
    return True


class BytecodeInput(BaseModel):
    bytecode: abi.Bytes


@adminrouter.advance(
    header=ABIFunctionSelectorHeader(
        function='set_bytecode',
        argument_types=['address']
    )
)
def set_bytecode(rollup: Rollup, data: RollupData):
    # Check if caller is an admin
    if not _is_admin(data.metadata.msg_sender):
        # Fail advance
        return False
    # Get payload without header
    payload_bytes = data.bytes_payload()[4:]
    payload: BytecodeInput = abi.decode_to_model(payload_bytes, BytecodeInput)
    tribe_factory._set_bytecode(payload.bytecode)
    return True
