class GeneticAlgorithm {
  constructor(cities, distances, populationSize = 100, generations = 500, mutationRate = 1) {
    this.cities = cities;
    this.distances = distances;
    this.populationSize = populationSize;
    this.generations = generations;
    this.mutationRate = mutationRate;
    this.startCity = cities[0];
  }

  generateInitialPopulation() {
    return Array.from({ length: this.populationSize }, () => {
      const route = this.shuffle(this.cities.slice(1));
      return [this.startCity, ...route, this.startCity];
    });
  }

  evaluateRoute(route) {
    let cost = 0;
    for (let i = 0; i < route.length - 1; i++) {
      const from = route[i];
      const to = route[i + 1];
      cost += this.distances[from][to];
    }

    console.log(`Rota avaliada: ${route.join(" -> ")}, Custo: ${cost}`);
    return cost;
  }

  select(population) {
    const tournamentSize = 5;
    const tournament = Array.from(
      { length: tournamentSize },
      () => population[Math.floor(Math.random() * population.length)]
    );
    return tournament.reduce((best, current) =>
      this.evaluateRoute(current) < this.evaluateRoute(best) ? current : best
    );
  }

  crossover(parent1, parent2) {
    const start = Math.floor(Math.random() * (parent1.length - 2)) + 1;
    const end = Math.floor(Math.random() * (parent1.length - 1 - start)) + start;

    const child = new Array(parent1.length).fill(null);
    child[0] = this.startCity;
    child[child.length - 1] = this.startCity;

    for (let i = start; i <= end; i++) {
      child[i] = parent1[i];
    }

    let parent2Index = 1;
    for (let i = 1; i < child.length - 1; i++) {
      if (child[i] === null) {
        while (child.includes(parent2[parent2Index])) {
          parent2Index++;
        }
        child[i] = parent2[parent2Index];
      }
    }

    return child;
  }

  mutate(route) {
    if (Math.random() < this.mutationRate) {
      const i = Math.floor(Math.random() * (route.length - 2)) + 1;
      const j = Math.floor(Math.random() * (route.length - 2)) + 1;
      [route[i], route[j]] = [route[j], route[i]];
    }
    return route;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  run() {
    let population = this.generateInitialPopulation();

    for (let generation = 0; generation < this.generations; generation++) {
      const newPopulation = [];
      for (let i = 0; i < this.populationSize; i++) {
        const parent1 = this.select(population);
        const parent2 = this.select(population);
        let child = this.crossover(parent1, parent2);
        child = this.mutate(child);
        newPopulation.push(child);
      }
      population = newPopulation;
    }

    const bestRoute = population.reduce((best, current) =>
      this.evaluateRoute(current) < this.evaluateRoute(best) ? current : best
    );

    return {
      route: bestRoute,
      cost: this.evaluateRoute(bestRoute),
    };
  }
}

const cities = ["A", "B", "C", "D", "E"];
const distances = {
  A: { A: 0, B: 2, C: 9, D: 10, E: 15 },
  B: { A: 2, B: 0, C: 6, D: 4, E: 7 },
  C: { A: 9, B: 6, C: 0, D: 8, E: 3 },
  D: { A: 10, B: 4, C: 8, D: 0, E: 5 },
  E: { A: 15, B: 7, C: 3, D: 5, E: 0 },
};

const ga = new GeneticAlgorithm(cities, distances);
const result = ga.run();

console.log("Melhor rota:", result.route.join(" -> "));
console.log("Custo mínimo:", result.cost);
