// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RAPDAOToken
 * @dev ERC20 토큰 구현 - RAPDAO 플랫폼용
 */
contract RAPDAOToken is ERC20, Ownable {
    // 토큰 decimals (18 = ETH와 동일)
    uint8 private constant _decimals = 18;
    
    // 최대 공급량 (10,000,000 RAP)
    uint256 private constant MAX_SUPPLY = 10_000_000 * 10**_decimals;
    
    // 이벤트
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    
    /**
     * @dev 컨트랙트 생성자
     * @param initialOwner 초기 소유자 주소
     */
    constructor(address initialOwner) 
        ERC20("RAPDAO Token", "RAP") 
        Ownable(initialOwner)
    {
        // 초기 공급량을 소유자에게 발행 (전체 1000만개)
        uint256 initialSupply = 10_000_000 * 10**_decimals;
        _mint(initialOwner, initialSupply);
        emit TokensMinted(initialOwner, initialSupply);
    }
    
    /**
     * @dev 토큰 발행 (오직 소유자만 가능)
     * @param to 받을 주소
     * @param amount 발행할 토큰 수량
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev 토큰 소각
     * @param amount 소각할 토큰 수량
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @dev 다른 주소의 토큰 소각 (승인 필요)
     * @param from 소각할 주소
     * @param amount 소각할 토큰 수량
     */
    function burnFrom(address from, uint256 amount) public {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }
    
    /**
     * @dev 최대 공급량 조회
     */
    function maxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
    }
    
    /**
     * @dev decimals 오버라이드
     */
    function decimals() public pure override returns (uint8) {
        return _decimals;
    }
}
