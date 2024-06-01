# Problem 3: Messy React
## Task 1: List out the computational inefficiencies and anti-patterns found in the code block below

```javascript
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
```
### There are some computational inefficiencies and anti-patterns that I found
1. 
``` javascript
const getPriority = (blockchain: any): number => {
...
```
The parameter **blockchain** is defined with the data type **any**. Using any undermines the clarity and robustness of TypeScript. 
2.
``` javascript
if (lhsPriority > -99) {
...
```
Use undefined variable: **lhsPriority**.
3. 
``` javascript
if (lhsPriority > -99) {
	if (balance.amount <= 0) {
...
```
Unnecessary using of **nested if statements**, this leads to "spaghetti code".
4. 
``` javascript
return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (lhsPriority > -99) {
        if (balance.amount <= 0) {
        return true;
        }
    }
    return false
})
```
The passed function just need to define the cases it returns **true**, no need to for the **return false** statement.
5.
``` javascript
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    if (leftPriority > rightPriority) {
        return -1;
    } else if (rightPriority > leftPriority) {
        return 1;
    }
});
...
```
In the compare function, one case is lack, that is **leftPriority === rightPriority**. More over, using multiple if statements for a compare function like this is not a good practice, we can make it much simpler.
6.
``` javascript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })
```
The constant **formattedBalances** is defined but never used.
7.
``` javascript
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
```
**balance** elements of **sortedBalances** do not have type **FormattedWalletBalance**
8.
``` javascript
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
```
9.
``` javascript
const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);
```
Interface **WalletBalance** does not have **blockchain** property.
10.
``` javascript
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
```
The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. But because there is no uniquely identifier for **balance**, so using index as key is might be acceptable. But this is not the best practice.
## Task 2: Provide a refactored version of the code
``` javascript
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();
    //Add string type for the blockchain variable
    const getPriority = (blockchain: string): number => {
        switch (blockchain) {
        case 'Osmosis':
            return 100
        case 'Ethereum':
            return 50
        case 'Arbitrum':
            return 30
        case 'Zilliqa':
            return 20
        case 'Neo':
            return 20
        default:
            return -99
        }
    }
    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            //Changed the property blockchain to currency
            const balancePriority = getPriority(balance.currency);
            //Fixed undefined lhsPriority variable to balancePriority
            return balancePriority > -99 && balance.amount <= 0;
        }).sort((lhs: WalletBalance, rhs: WalletBalance)=>{
            //Changed the property blockchain to currency
            const leftPriority = getPriority(lhs.currency);
            //Changed the property blockchain to currency
            const rightPriority = getPriority(rhs.currency);
            //Using an expression instead of multiple if statements
            return rightPriority - leftPriority;
        });
    },[balances, prices]);

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed()
        };
    })

    //Use formattedBalances instead of sortedBalances
    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow 
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
            />
        )
    })

    return (
    <div {...rest}>
      {rows}
    </div>
  )
}
```