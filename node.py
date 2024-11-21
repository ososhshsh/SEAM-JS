import tensorflow as tf
from tensorflow.python.framework import graph_util


def clean_and_freeze_model(input_pb_path, output_pb_path, output_nodes):
    with tf.compat.v1.Session(graph=tf.Graph()) as sess:
        # Load the original graph
        with tf.io.gfile.GFile(input_pb_path, 'rb') as f:
            graph_def = tf.compat.v1.GraphDef()
            graph_def.ParseFromString(f.read())
            tf.import_graph_def(graph_def, name='')

        # Inspect and list all nodes
        print("\n--- Nodes in the Original Graph ---")
        for node in graph_def.node:
            print(f"Node Name: {node.name}, Operation: {node.op}")

        # Remove problematic nodes
        unsupported_nodes = ['QueueDequeueUpToV2', 'FIFOQueueV2', 'batch_join']  # Add more if necessary
        nodes_to_remove = [node.name for node in graph_def.node if node.op in unsupported_nodes]
        print(f"\n--- Nodes to Remove: {nodes_to_remove} ---")

        new_graph_def = tf.compat.v1.GraphDef()
        for node in graph_def.node:
            if node.name not in nodes_to_remove:
                new_graph_def.node.append(node)  # Keep only valid nodes
            else:
                print(f"Removing unsupported node: {node.name} ({node.op})")

        # Add placeholders for missing input nodes if necessary
        for node_name in nodes_to_remove:
            placeholder_node = new_graph_def.node.add()
            placeholder_node.name = node_name
            placeholder_node.op = "Placeholder"
            placeholder_node.attr["dtype"].type = tf.float32.as_datatype_enum
            print(f"Added placeholder for removed node: {node_name}")

        # Import the cleaned graph
        tf.import_graph_def(new_graph_def, name='')

        # Freeze the graph (convert variables to constants)
        frozen_graph = graph_util.convert_variables_to_constants(
            sess,
            sess.graph_def,
            output_nodes  # Specify your output node names
        )

        # Save the cleaned and frozen graph
        with tf.io.gfile.GFile(output_pb_path, 'wb') as f:
            f.write(frozen_graph.SerializeToString())
        print(f"\nCleaned and frozen model saved at: {output_pb_path}")


# Define paths and output nodes
input_pb = '/project/workspace/public/models/saved_model.pb'  # Path to the original .pb file
output_pb = '/project/workspace/public/models/saved_model2.pb'  # Path to save the cleaned .pb file
output_nodes = ['output_node_name']  # Replace with your model's actual output node names

# Run the cleaning and freezing process
clean_and_freeze_model(input_pb, output_pb, output_nodes)
