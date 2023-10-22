"""
Voucher Generation Helper
"""
from pydantic import BaseModel
from Crypto.Hash import keccak

from cartesi import abi


def create_voucher_from_model(
    destination: abi.Address,
    function_name: str,
    args_model: BaseModel
):
    """
    Generates a voucher for a given contract, function and arguments.

    The function selector will be generated dynamically given the function
    name and pydantic model containing arguments.

    Parameters
    ----------
    destination : abi.Address
        Address of the contract that will be called
    function_name : str
        Name of the function to be called
    args_model : BaseModel
        Pydantic model with ABI type annotations with the parameters

    Returns
    -------
    dict
        Dictionary ready to be passed to rollup.voucher().
    """
    args_types = abi.get_abi_types_from_model(args_model)
    signature = f'{function_name}({",".join(args_types)})'
    sig_hash = keccak.new(digest_bits=256)
    sig_hash.update(signature.encode('utf-8'))

    selector = sig_hash.digest()[:4].hex()

    args = abi.encode_model(args_model).hex()

    voucher = {
        'destination': destination,
        'payload': '0x' + selector + args
    }
    return voucher


class WithdrawEtherParams(BaseModel):
    receiver: abi.Address
    amount: abi.UInt256


def withdraw_ether(
    rollup_address,
    receiver_address: abi.Address,
    amount: abi.UInt256
):
    params = WithdrawEtherParams(
        receiver=receiver_address,
        amount=amount,
    )
    return create_voucher_from_model(
        destination=rollup_address,
        function_name='withdrawEther',
        args_model=params,
    )


class LaunchStrategyParams(BaseModel):
    presale_start_time: abi.UInt256
    presale_end_time: abi.UInt256
    presale_price: abi.UInt256
    sale_start_time: abi.UInt256
    sale_end_time: abi.UInt256
    sale_price: abi.UInt256


def launch_strategy(
    tribe_address: abi.Address,
    presale_start_time: abi.UInt256,
    presale_end_time: abi.UInt256,
    presale_price: abi.UInt256,
    sale_start_time: abi.UInt256,
    sale_end_time: abi.UInt256,
    sale_price: abi.UInt256,
):
    params = LaunchStrategyParams(
        presale_start_time=presale_start_time,
        presale_end_time=presale_end_time,
        presale_price=presale_price,
        sale_start_time=sale_start_time,
        sale_end_time=sale_end_time,
        sale_price=sale_price,
    )
    return create_voucher_from_model(
        destination=tribe_address,
        function_name='launchStrategy',
        args_model=params,
    )


class SupportersMintParams(BaseModel):
    token_id: abi.UInt256
    amount: abi.UInt256
    account: abi.Address


def mint_supporter_tokens(
    supporter_contract: abi.Address,
    supporter_address: abi.Address,
    amount: abi.UInt256,
):
    params = SupportersMintParams(
        token_id=1,
        amount=amount,
        account=supporter_address,
    )
    return create_voucher_from_model(
        destination=supporter_contract,
        function_name='mint',
        args_model=params,
    )
