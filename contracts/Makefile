# LOADING ENV FILE
-include .env

.PHONY: deploy cartesi env

# DEFAULT VARIABLES	
START_LOG = @echo "==================== START OF LOG ===================="
END_LOG = @echo "==================== END OF LOG ======================"


ifeq ($(CONFIG),--network sepolia)
	RPC_URL := $(SEPOLIA_RPC_URL)
	DEPLOY_NETWORK_ARGS := script/TribesFactoryDeploy.s.sol --rpc-url $(SEPOLIA_RPC_URL) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)
else ifeq ($(CONFIG),--network mumbai)
	RPC_URL := $(MUMBAI_RPC_URL)
	DEPLOY_NETWORK_ARGS := script/TribesFactoryDeploy.s.sol --rpc-url $(MUMBAI_RPC_URL) --broadcast --verify --etherscan-api-key $(POLYGONSCAN_API_KEY)
endif

define tribes_factory_deploy
	$(START_LOG)
	@forge test
	@forge script $(DEPLOY_NETWORK_ARGS) -vvvvv
	$(END_LOG)
endef

define set_cartesi
	$(START_LOG)
	@cast send $(1) "setCartesiDapp(address)" $(2) --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY)
	$(END_LOG)
endef

env: .env.tmpl
	cp env.tmpl .env

deploy:
	@echo "Deploying Tribes Factory..."
	@$(tribes_factory_deploy)

cartesi:
	@echo "Setting Cartesi DApp Contract..."
	@$(call set_cartesi, $(contract), $(dapp))