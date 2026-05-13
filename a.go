package main

import "fmt"

// Interface Sellable
type Sellable interface {
	RestockFull() float64
	Sell(quantity int) float64
}

// Type BookShelf
type BookShelf struct {
	Name           string
	Capacity       int
	CurrentBooks   int
	WholesalePrice float64
	RetailPrice    float64
}

// Type CoffeeStand
type CoffeeStand struct {
	Name         string
	BeanCapacity float64
	CurrentBeans float64
	BeansPerCup  float64
	CostPerKg    float64
	PricePerCup  float64
}

// Methods for BookShelf
func (b *BookShelf) RestockFull() float64 {
	needed := b.Capacity - b.CurrentBooks
	if needed < 0 {
		needed = 0
	}

	cost := float64(needed) * b.WholesalePrice
	b.CurrentBooks = b.Capacity
	return cost
}

func (b *BookShelf) Sell(quantity int) float64 {
	if quantity <= 0 || quantity > b.CurrentBooks {
		return 0
	}

	b.CurrentBooks -= quantity
	return float64(quantity) * b.RetailPrice
}

// Methods for CoffeeStand
func (c *CoffeeStand) RestockFull() float64 {
	needed := c.BeanCapacity - c.CurrentBeans
	if needed < 0 {
		needed = 0
	}

	cost := needed * c.CostPerKg
	c.CurrentBeans = c.BeanCapacity
	return cost
}

func (c *CoffeeStand) Sell(quantity int) float64 {
	if quantity <= 0 {
		return 0
	}

	beansNeeded := float64(quantity) * c.BeansPerCup
	if beansNeeded > c.CurrentBeans {
		return 0
	}

	c.CurrentBeans -= beansNeeded
	return float64(quantity) * c.PricePerCup
}

// Function to sell all items
func sellAllItems(items []Sellable, quantity int) float64 {
	var total float64

	for _, item := range items {
		total += item.Sell(quantity)
	}

	return total
}

func main() {
	books := BookShelf{
		Name:           "Programming Books",
		Capacity:       40,
		CurrentBooks:   25,
		WholesalePrice: 12,
		RetailPrice:    25,
	}

	coffee := CoffeeStand{
		Name:         "Coffee Bar",
		BeanCapacity: 10,
		CurrentBeans: 4,
		BeansPerCup:  0.08,
		CostPerKg:    18,
		PricePerCup:  3.5,
	}

	items := []Sellable{&books, &coffee}
	quantity := 20
	totalRevenue := sellAllItems(items, quantity)

	fmt.Printf("Total revenue for selling %d units from each item: %.2f\n", quantity, totalRevenue)
}
