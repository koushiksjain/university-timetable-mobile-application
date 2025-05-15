# python_models/utils/graph_utils.py
import networkx as nx
from typing import Dict, List

class GraphUtils:
    """Utility class for graph operations related to timetabling"""
    
    @staticmethod
    def build_conflict_graph(events: List[Dict]) -> nx.Graph:
        """Build a conflict graph from list of events"""
        G = nx.Graph()
        
        # Add all events as nodes
        for event in events:
            G.add_node(event['id'], **event)
        
        # Add edges between conflicting events
        for i, event1 in enumerate(events):
            for event2 in events[i+1:]:
                if GraphUtils.events_conflict(event1, event2):
                    G.add_edge(event1['id'], event2['id'])
        
        return G
    
    @staticmethod
    def events_conflict(event1: Dict, event2: Dict) -> bool:
        """Check if two events conflict (can't be scheduled at same time)"""
        # Check teacher conflict
        if event1.get('teacher') == event2.get('teacher'):
            return True
            
        # Check room conflict if specified
        if 'room' in event1 and 'room' in event2 and event1['room'] == event2['room']:
            return True
            
        # Check student group conflict
        if set(event1.get('student_groups', [])).intersection(event2.get('student_groups', [])):
            return True
            
        return False
    
    @staticmethod
    def color_graph(graph: nx.Graph) -> Dict:
        """Color the graph using greedy algorithm"""
        return nx.coloring.greedy_color(graph, strategy='largest_first')
    
    @staticmethod
    def find_connected_components(graph: nx.Graph) -> List[nx.Graph]:
        """Find connected components in the graph"""
        return [graph.subgraph(c).copy() for c in nx.connected_components(graph)]
    
    @staticmethod
    def visualize_graph(graph: nx.Graph):
        """Visualize the conflict graph (requires matplotlib)"""
        try:
            import matplotlib.pyplot as plt
            pos = nx.spring_layout(graph)
            nx.draw(graph, pos, with_labels=True, node_color='lightblue', 
                   edge_color='gray', node_size=500, font_size=8)
            plt.show()
        except ImportError:
            print("Visualization requires matplotlib. Install with: pip install matplotlib")

    @staticmethod
    def calculate_graph_metrics(graph: nx.Graph) -> Dict:
        """Calculate various metrics for the conflict graph"""
        metrics = {
            'num_nodes': graph.number_of_nodes(),
            'num_edges': graph.number_of_edges(),
            'density': nx.density(graph),
            'average_degree': sum(dict(graph.degree()).values()) / graph.number_of_nodes(),
            'clustering_coefficient': nx.average_clustering(graph),
            'connected_components': nx.number_connected_components(graph)
        }
        return metrics